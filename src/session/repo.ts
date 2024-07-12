import { Database } from "bun:sqlite";

import { User } from "@/user";
import { Pagination } from "@/utils";
import { Session } from "./types";

export interface SessionRepo {
  create(userId: User["id"], expiresAt: Date): Promise<Session>;
  findById(id: Session["id"]): Promise<Session | null>;
  findPaginated(page: number, perPage: number): Promise<Pagination<Session>>;
  deleteById(id: Session["id"]): Promise<void>;
  deleteByUserId(userId: User["id"]): Promise<void>;
}

export class SessionRepoSqlite implements SessionRepo {
  constructor(private db: Database) {}

  async create(userId: User["id"], expiresAt: Date): Promise<Session> {
    const session = this.db
      .query(
        "INSERT INTO session (userId, expiresAt) VALUES (?, ?) RETURNING *",
      )
      .as(Session)
      .get(userId, expiresAt.toISOString())!;
    return session;
  }

  async findById(id: Session["id"]): Promise<Session | null> {
    const session = this.db
      .query("SELECT * FROM session WHERE id = ?")
      .as(Session)
      .get(id);
    if (session) {
      session.expiresAt = new Date(session.expiresAt);
      session.createdAt = new Date(session.createdAt);
    }
    return session;
  }

  async deleteById(id: Session["id"]): Promise<void> {
    this.db.exec("DELETE FROM session WHERE id = ?", [id]);
  }

  async deleteByUserId(userId: number): Promise<void> {
    this.db.exec("DELETE FROM session WHERE userId = ?", [userId]);
  }

  async findPaginated(
    page: number,
    perPage: number,
  ): Promise<Pagination<Session>> {
    const limit = perPage;
    const offset = (page - 1) * limit;
    const sessions = this.db
      .query("SELECT * FROM session ORDER BY createdAt LIMIT ? OFFSET ?")
      .as(Session)
      .all(limit, offset);
    sessions.forEach((s) => {
      s.createdAt = new Date(s.createdAt);
      s.expiresAt = new Date(s.expiresAt);
    });
    const count = this.db
      .query("SELECT COUNT(*) as totalSessions  FROM session")
      .get() as {
      totalSessions: number;
    };
    return Pagination.from({
      perPage,
      totalItems: count.totalSessions,
      currentPage: page,
      data: sessions,
    });
  }
}

export class SessionRepoInMemory implements SessionRepo {
  constructor(
    private generateId: () => Session["id"],
    private memory: Map<Session["id"], Session>,
  ) {}

  async create(userId: User["id"], expiresAt: Date): Promise<Session> {
    const session: Session = {
      id: this.generateId(),
      userId,
      expiresAt,
      createdAt: new Date(),
    };
    this.memory.set(session.id, session);
    return session;
  }

  async findById(id: Session["id"]): Promise<Session | null> {
    return this.memory.get(id) ?? null;
  }

  async deleteById(id: Session["id"]): Promise<void> {
    this.memory.delete(id);
  }

  async deleteByUserId(userId: User["id"]): Promise<void> {
    for (const s of this.memory.values()) {
      if (s.userId === userId) {
        this.memory.delete(s.id);
      }
    }
  }

  async findPaginated(
    page: number,
    perPage: number,
  ): Promise<Pagination<Session>> {
    const sessions = [...this.memory.values()].sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return Pagination.from({
      perPage,
      totalItems: sessions.length,
      currentPage: page,
      data: sessions,
    });
  }
}
