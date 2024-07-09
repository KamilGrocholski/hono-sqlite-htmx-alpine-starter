import { z } from "zod";

export enum UserRole {
  User = "user",
  Admin = "admin",
}

export class User {
  id!: number;
  email!: string;
  password!: string;
  role!: UserRole;
}

export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string({ required_error: "E-mail is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(5, { message: "Minimum length is 5" })
    .max(255, { message: "Maximum length is 255" }),
  role: z.nativeEnum(UserRole),
});
