import { connectDB } from "./db";

import { AuthService } from "@/auth";
import { authService } from "../.";

(async function (authService: AuthService) {
  const db = connectDB();

  const tx = db.transaction(async () => {
    await authService.registerAdmin(
      process.env.ADMIN_EMAIL!,
      process.env.ADMIN_PASSWORD!,
    );
    await authService.registerUser(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!,
    );
    console.log("database ", db.filename, "seeded");
  });
  await tx();

  db.close();
})(authService);
