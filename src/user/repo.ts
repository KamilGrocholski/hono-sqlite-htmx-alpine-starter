import { Database } from "bun:sqlite";

import { User, UserRole } from "./types";
import { Pagination } from "@/utils/pagination";

export interface UserRepo {
  create(email: string, password: string, role: UserRole): Promise<void>;
  findById(id: User["id"]): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findPaginated(page: number, perPage: number): Promise<Pagination<User>>;
}

export class UserRepoSqlite implements UserRepo {
  constructor(private db: Database) {}

  async create(email: string, password: string, role: UserRole): Promise<void> {
    this.db.exec("INSERT INTO user (email, password, role) VALUES (?, ?, ?)", [
      email,
      password,
      role,
    ]);
  }

  async findById(id: number): Promise<User | null> {
    const user = this.db
      .query("SELECT * FROM user WHERE id = ?")
      .as(User)
      .get(id);
    if (user) {
      user.createdAt = new Date(user.createdAt);
      user.updatedAt = new Date(user.updatedAt);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.db
      .query("SELECT * FROM user WHERE email = ?")
      .as(User)
      .get(email);
    if (user) {
      user.createdAt = new Date(user.createdAt);
      user.updatedAt = new Date(user.updatedAt);
    }
    return user;
  }

  async findPaginated(
    page: number,
    perPage: number,
  ): Promise<Pagination<User>> {
    const limit = perPage;
    const offset = (page - 1) * limit;
    const users = this.db
      .query("SELECT * FROM user ORDER BY createdAt LIMIT ? OFFSET ?")
      .as(User)
      .all(limit, offset);
    const count = this.db
      .query("SELECT COUNT(*) as totalUsers  FROM user")
      .get() as {
      totalUsers: number;
    };
    const totalPages = Math.ceil(count.totalUsers / perPage);

    return Pagination.from({
      perPage,
      totalItems: totalPages,
      currentPage: page,
      data: users,
    });
  }
}

export class UserRepoInMemory implements UserRepo {
  constructor(
    private generateId: () => User["id"],
    private memory: Map<User["id"], User>,
  ) {}

  async create(email: string, password: string, role: UserRole): Promise<void> {
    const now = new Date();
    const user: User = {
      id: this.generateId(),
      email,
      password,
      role,
      createdAt: now,
      updatedAt: now,
    };
    this.memory.set(user.id, user);
  }

  async findById(id: number): Promise<User | null> {
    return this.memory.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = this.memory.values();
    for (const u of users) {
      if (u.email === email) {
        return u;
      }
    }
    return null;
  }

  async findPaginated(
    page: number,
    perPage: number,
  ): Promise<Pagination<User>> {
    const users = [...this.memory.values()].sort((a, b) => {
      return a.createdAt > b.createdAt ? 1 : -1;
    });
    return Pagination.from({
      perPage,
      totalItems: users.length,
      currentPage: page,
      data: users,
    });
  }
}
