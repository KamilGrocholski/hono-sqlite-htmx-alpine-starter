import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { showRoutes } from "hono/dev";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { connectDB } from "@/db";
import { UserRepoSqlite, UserService } from "@/user";
import { SessionRepoSqlite } from "@/session";
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
} from "@/shared";
import { env } from "@/env";
import { AppContext } from "@/types";

const db = connectDB();

const userRepo = new UserRepoSqlite(db);
const sessionRepo = new SessionRepoSqlite(db);

const userService = new UserService(userRepo);
const jwtService = new JwtService("jwt", env.JWT_EXP_MINUTES, env.JWT_SECRET);
export const authService = new AuthService(
  () => new Date(Date.now() + 1000 * 60 * env.SESSION_EXP_TIME_MINUTES),
  sessionRepo,
  userRepo,
  jwtService,
);

const app = new Hono<AppContext>();

if (env.NODE_ENV === "development") {
  app.use(logger());
}

app.use("*", secureHeaders());

app.use(jwtMiddleware(jwtService));

app.notFound(async (c) => c.html(<NotFoundPage />));

app.use("/public/*", async (c, next) => {
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

const panelApp = new Hono<AppContext>();
panelApp.use(authOnlyMiddleware(authService));
panelApp.get("/", async (c) => {
  const { userId } = c.get("jwtPayload");
  const user = await userService.findById(userId);
  return c.html(
    <PanelPage user={{ email: user?.email || "", role: user?.role || "" }} />,
  );
});
app.route("/panel", panelApp);

const adminApp = new Hono<AppContext>();
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
  ),
  async (c) => {
    const query = c.req.valid("query");
    const usersPagination = await userService.findPaginated(
      query.page,
      query.perPage,
    );
    return c.html(
      <div id="users-table" class="flex flex-col items-center gap-5">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Id</th>
                <th>E-mail</th>
                <th>Role</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {usersPagination.page.data.map((user, userIdx) => (
                <tr>
                  <th>{userIdx + 1}</th>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div class="join">
          <button
            class={`join-item btn ${!usersPagination.page.meta.hasPrev ? "btn-disabled" : ""}`}
            hx-get={`/admin/users?page=${usersPagination.page.meta.currentPage - 1}&perPage=${usersPagination.page.meta.perPage}`}
            hx-swap="outerHTML"
            hx-target="closest #users-table"
          >
            «
          </button>
          <button class="join-item btn">
            Page {usersPagination.page.meta.currentPage}
          </button>
          <button
            class={`join-item btn ${!usersPagination.page.meta.hasNext ? "btn-disabled" : ""}`}
            hx-get={`/admin/users?page=${usersPagination.page.meta.currentPage + 1}&perPage=${usersPagination.page.meta.perPage}`}
            hx-swap="outerHTML"
            hx-target="closest #users-table"
          >
            »
          </button>
        </div>
      </div>,
    );
  },
);
app.route("/admin", adminApp);

if (env.NODE_ENV === "development") {
  showRoutes(app, { verbose: true, colorize: true });
}

export default app;
