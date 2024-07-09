import { Hono } from "hono";

import { LandingPage } from "@/shared";
import { authApp } from "@/auth/app";
import { connectDB } from "@/db";
import { UserRepoSqlite } from "@/user";
import { SessionRepoSqlite } from "@/session";
import { AuthService, authMiddleware } from "@/auth";
import { JwtService, jwtMiddleware } from "@/jwt";

const db = connectDB();

const userRepo = new UserRepoSqlite(db);
const sessionRepo = new SessionRepoSqlite(db);

const jwtService = new JwtService(process.env.JWT_SECRET!);
const authService = new AuthService(
  () =>
    new Date(
      Date.now() + 1000 * 60 * Number(process.env.SESSION_EXP_TIME_MINUTES!),
    ),
  sessionRepo,
  userRepo,
  jwtService,
);

const app = new Hono();
app.use(jwtMiddleware(jwtService));

app.get("/", async (c) => {
  return c.html(<LandingPage />);
});

app.route("/", authApp(authService));

const panelApp = new Hono();
panelApp.use(authMiddleware(authService));

app.route("/panel", panelApp);

export default app;
