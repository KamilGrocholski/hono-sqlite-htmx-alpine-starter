import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { showRoutes } from "hono/dev";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { connectDB } from "@/db";
import { UserRepoSqlite, UserService } from "@/user";
import { SessionRepoSqlite, SessionService } from "@/session";
import {
  AuthService,
  authOnlyMiddleware,
  createAuthApp,
  adminOnlyMiddleware,
} from "@/auth";
import { JwtService, jwtMiddleware } from "@/jwt";
import {
  InternalServerErrorPage,
  LandingPage,
  NotFoundPage,
  UnauthenticatedPage,
  UnauthorizedPage,
  PanelPage,
  AdminPanelPage,
  UsersTable,
  SessionsTable,
  SessionsTableTryAgain,
  UsersTableTryAgain,
} from "@/shared";
import { env } from "@/env";
import { AppContextEnv } from "@/types";
import { PublicError } from "@/errors";

const db = connectDB();

const userRepo = new UserRepoSqlite(db);
const sessionRepo = new SessionRepoSqlite(db);

const sessionService = new SessionService(sessionRepo);
const userService = new UserService(userRepo);
const jwtService = new JwtService("jwt", env.JWT_EXP_MINUTES, env.JWT_SECRET);
export const authService = new AuthService(
  () => new Date(Date.now() + 1000 * 60 * env.SESSION_EXP_TIME_MINUTES),
  sessionRepo,
  userRepo,
  jwtService,
);

const app = new Hono<AppContextEnv>();

if (env.NODE_ENV === "development") {
  app.use(logger());
}

app.use("*", secureHeaders());

app.use((c, next) => {
  const isHtmxRequest = c.req.header("HX-Request") === "true";
  c.set("isHtmxRequest", isHtmxRequest);
  return next();
});
app.use(jwtMiddleware(jwtService));

app.notFound(async (c) => c.html(<NotFoundPage />));

app.use("/static/*", async (c, next) => {
  c.res.headers.set("Cache-Control", "private,max-age=31536000,immutable");
  return await serveStatic({ root: "./" })(c, next);
});

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

app.route("", createAuthApp(authService, jwtService));

const panelApp = new Hono<AppContextEnv>();
panelApp.use(authOnlyMiddleware(authService));
panelApp.get("/", async (c) => {
  const { userId } = c.get("jwtPayload");
  const user = await userService.findById(userId);
  return c.html(
    <PanelPage user={{ email: user?.email || "", role: user?.role || "" }} />,
  );
});
app.route("/panel", panelApp);

const adminApp = new Hono<AppContextEnv>();
adminApp.use(authOnlyMiddleware(authService), adminOnlyMiddleware(authService));

adminApp.get("/", async (c) => {
  const { userId } = c.get("jwtPayload");
  const user = await userService.findById(userId);
  return c.html(
    <AdminPanelPage
      user={{ email: user?.email || "", role: user?.role || "" }}
    />,
  );
});

adminApp.get(
  "/users",
  zValidator(
    "query",
    z.object({
      page: z.coerce.number().int().positive(),
      perPage: z.coerce.number().int().positive(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.html(
          <span class="text-error">Bad request, reload the page</span>,
        );
      }
    },
  ),
  async (c) => {
    const query = c.req.valid("query");
    try {
      const usersPagination = await userService.findPaginated(
        query.page,
        query.perPage,
      );
      return c.html(
        <UsersTable
          {...usersPagination.page.meta}
          users={usersPagination.page.data}
        />,
      );
    } catch (err) {
      return c.html(
        <UsersTableTryAgain
          message={PublicError.SomethingWentWrong.message}
          page={query.page}
          perPage={query.perPage}
        />,
      );
    }
  },
);

adminApp.get(
  "/sessions",
  zValidator(
    "query",
    z.object({
      page: z.coerce.number().int().positive(),
      perPage: z.coerce.number().int().positive(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.html(
          <span class="text-error">Bad request, reload the page</span>,
        );
      }
    },
  ),
  async (c) => {
    const query = c.req.valid("query");
    try {
      const sessionsPagination = await sessionService.findPaginated(
        query.page,
        query.perPage,
      );
      return c.html(
        <SessionsTable
          {...sessionsPagination.page.meta}
          sessions={sessionsPagination.page.data}
        />,
      );
    } catch (err) {
      return c.html(
        <SessionsTableTryAgain
          message={PublicError.SomethingWentWrong.message}
          page={query.page}
          perPage={query.perPage}
        />,
      );
    }
  },
);

app.route("/admin", adminApp);

if (env.NODE_ENV === "development") {
  showRoutes(app, { verbose: false, colorize: true });
}

export default app;
