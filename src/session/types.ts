import { User } from "@/user";

export class Session {
  id!: number;
  userId!: User["id"];
  expiresAt!: Date;
  createdAt!: Date;
}
