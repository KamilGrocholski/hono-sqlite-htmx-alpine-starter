import { connectDB } from "./db";

import { env } from "@/env";
import { AuthService } from "@/auth";
import { authService } from "../.";

(async function (authService: AuthService) {
  const db = connectDB();

  const tx = db.transaction(async () => {
    await authService.registerAdmin(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
    await authService.registerUser(env.USER_EMAIL, env.USER_PASSWORD);
    console.log("seeded: ", db.filename);
  });
  await tx();

  db.close();
})(authService);
