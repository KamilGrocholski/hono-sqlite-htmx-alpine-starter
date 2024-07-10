import { Database } from "bun:sqlite";

import { env } from "@/env";

export function connectDB(): Database {
  return new Database(env.DB_URL!);
}
