import { Hono } from "hono";
import { logger } from "hono/logger";

import { connectDB } from "@/db";
import { UserRepoSqlite } from "@/user";
import { SessionRepoSqlite } from "@/session";
import { AuthService, authMiddleware, authApp, adminMiddleware } from "@/auth";
import { JwtService, jwtMiddleware } from "@/jwt";
import {
  InternalServerErrorPage,
  LandingPage,
  NotFoundPage,
  UnauthenticatedPage,
  UnauthorizedPage,
  PanelPage,
  AdminPanelPage,
  AppContext,
} from "@/shared";
import { ConfigService } from "@/config";

// TODO how to use it everywhere
const configService = new ConfigService((name) => process.env[name]);

const db = connectDB();

const userRepo = new UserRepoSqlite(db);
const sessionRepo = new SessionRepoSqlite(db);

const jwtService = new JwtService(configService.env.JWT_SECRET);
export const authService = new AuthService(
  () =>
    new Date(
      Date.now() + 1000 * 60 * configService.env.SESSION_EXP_TIME_MINUTES,
    ),
  sessionRepo,
  userRepo,
  jwtService,
);

const app = new Hono<AppContext>();

if (configService.env.NODE_ENV === "development") {
  app.use(logger());
}

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

app.route("", authApp(configService, authService));

const panelApp = new Hono<AppContext>();
panelApp.use(authMiddleware(authService));
panelApp.get("/", (c) => c.html(<PanelPage />));
app.route("/panel", panelApp);

const adminApp = new Hono<AppContext>();
adminApp.use(authMiddleware(authService), adminMiddleware(authService));
adminApp.get("/", (c) => c.html(<AdminPanelPage />));
app.route("/admin", adminApp);

export default app;
