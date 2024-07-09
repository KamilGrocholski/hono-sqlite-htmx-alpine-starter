import { z } from "zod";

export class User {
  id!: number;
  email!: string;
  password!: string;
}

export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  password: z.string().trim().min(5).max(255),
});
