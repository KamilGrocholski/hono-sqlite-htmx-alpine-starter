import { Database } from "bun:sqlite";

export function connectDB(): Database {
  return new Database(process.env.DB_URL!);
}
