import { Database } from "bun:sqlite";

import { User, UserRole } from "./types";

export interface UserRepo {
  create(email: string, password: string, role: UserRole): Promise<void>;
  findById(id: User["id"]): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
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
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.db
      .query("SELECT * FROM user WHERE email = ?")
      .as(User)
      .get(email);
    return user;
  }
}

export class UserRepoInMemory implements UserRepo {
  constructor(
    private generateId: () => User["id"],
    private memory: Map<User["id"], User>,
  ) {}

  async create(email: string, password: string, role: UserRole): Promise<void> {
    const user: User = {
      id: this.generateId(),
      email,
      password,
      role,
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
}
