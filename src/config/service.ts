import { z } from "zod";

type Getter = (name: string) => string | undefined;

export type Config = z.output<typeof configSchema>;

const configSchema = z.object({
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

export class ConfigService<const T extends Config = Config> {
  public env: T;
  constructor(getter: Getter) {
    const input = {
      DB_URL: getter("DB_URL"),

      JWT_SECRET: getter("JWT_SECRET"),
      JWT_EXP_MINUTES: getter("JWT_EXP_MINUTES"),

      SESSION_EXP_TIME_MINUTES: getter("SESSION_EXP_TIME_MINUTES"),

      ADMIN_EMAIL: getter("ADMIN_EMAIL"),
      ADMIN_PASSWORD: getter("ADMIN_PASSWORD"),
      USER_EMAIL: getter("USER_EMAIL"),
      USER_PASSWORD: getter("USER_PASSWORD"),

      NODE_ENV: getter("NODE_ENV"),
    };
    this.env = configSchema.parse(input) as T;
  }
}
