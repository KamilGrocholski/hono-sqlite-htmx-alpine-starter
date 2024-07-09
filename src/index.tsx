import { Hono } from "hono";

import { connectDB } from "@/db";
import { UserRepoSqlite } from "@/user";
import { SessionRepoSqlite } from "@/session";
import { AuthService, authMiddleware, authApp } from "@/auth";
import { JwtService, jwtMiddleware } from "@/jwt";
import {
  InternalServerErrorPage,
  LandingPage,
  NotFoundPage,
  UnauthenticatedPage,
  UnauthorizedPage,
  PanelPage,
} from "@/shared";

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

app.notFound(async (c) => c.html(<NotFoundPage />));

app.get("/", async (c) => {
  return c.html(<LandingPage />);
});

app.get("/401", async (c) => {
  return c.html(<UnauthenticatedPage />);
});

app.get("/403", async (c) => {
  return c.html(<UnauthorizedPage />);
});

app.get("/500", async (c) => {
  return c.html(<InternalServerErrorPage />);
});

app.route("", authApp(authService));

const panelApp = new Hono();
panelApp.use(authMiddleware(authService));
panelApp.get("/", (c) => c.html(<PanelPage />));

app.route("/panel", panelApp);

export default app;
