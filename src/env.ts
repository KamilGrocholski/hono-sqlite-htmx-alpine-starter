import { z } from "zod";

export type Env = z.output<typeof envSchema>;

type EnvInput = { [Key in keyof Env]: string | undefined };

const envSchema = z.object({
  DB_URL: z.string().trim().min(1),

  JWT_SECRET: z.string().trim().min(1),
  JWT_EXP_MINUTES: z.coerce.number().int().positive(),

  SESSION_EXP_TIME_MINUTES: z.coerce.number().int().positive(),

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().trim(),
  USER_EMAIL: z.string().email(),
  USER_PASSWORD: z.string().trim(),

  NODE_ENV: z.enum(["development", "test", "production"]),
});

const input: EnvInput = {
  DB_URL: process.env["DB_URL"],

  JWT_SECRET: process.env["JWT_SECRET"],
  JWT_EXP_MINUTES: process.env["JWT_EXP_MINUTES"],

  SESSION_EXP_TIME_MINUTES: process.env["SESSION_EXP_TIME_MINUTES"],

  ADMIN_EMAIL: process.env["ADMIN_EMAIL"],
  ADMIN_PASSWORD: process.env["ADMIN_PASSWORD"],
  USER_EMAIL: process.env["USER_EMAIL"],
  USER_PASSWORD: process.env["USER_PASSWORD"],

  NODE_ENV: process.env["NODE_ENV"],
};

export const env = envSchema.parse(input);
