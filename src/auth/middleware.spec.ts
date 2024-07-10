import { describe, test, expect, beforeEach } from "bun:test";
import { Hono } from "hono";

import { JwtPayload, JwtService, jwtMiddleware } from "@/jwt";
import { Session, SessionRepo, SessionRepoInMemory } from "@/session";
import { User, UserRepo, UserRepoInMemory, UserRole } from "@/user";
import { adminMiddleware, authMiddleware } from "./middleware";
import { AuthService } from "./service";

describe("Auth middlewares", async () => {
  let app: Hono;
  let jwtService: JwtService;
  let authService: AuthService;
  let sessionRepo: SessionRepo;
  let userRepo: UserRepo;

  function idGenerator() {
    let curr = 1;
    return () => curr++;
  }

  const adminUser: User = {
    id: 1,
    email: "admin@gmail.com",
    password: "Haslo1234",
    role: UserRole.Admin,
  };

  const adminUserSession: Session = {
    id: 1,
    userId: adminUser.id,
    expiresAt: new Date(Date.now() + 10_000),
  };

  const userUser: User = {
    id: 2,
    email: "user@gmail.com",
    password: "Haslo1234",
    role: UserRole.User,
  };

  const userUserSession: Session = {
    id: 2,
    userId: userUser.id,
    expiresAt: new Date(Date.now() + 10_000),
  };

  beforeEach(() => {
    userRepo = new UserRepoInMemory(
      idGenerator(),
      new Map([
        [adminUser.id, adminUser],
        [userUser.id, userUser],
      ]),
    );
    sessionRepo = new SessionRepoInMemory(
      idGenerator(),
      new Map([
        [adminUserSession.id, adminUserSession],
        [userUserSession.id, userUserSession],
      ]),
    );
    jwtService = new JwtService("jwt", 15, "secret");
    authService = new AuthService(
      () => new Date(Date.now() + 10_000),
      sessionRepo,
      userRepo,
      jwtService,
    );
    app = new Hono();
    app.use(jwtMiddleware(jwtService));
  });

  test("should verify role admin and finish the request successfully", async () => {
    app.use(authMiddleware(authService));
    app.use(adminMiddleware(authService));

    let jwtPayload = null;
    app.get("/path", async (c) => {
      jwtPayload = c.get("jwtPayload");
    });
    const expectedJwtPayload: JwtPayload = {
      sessionId: adminUserSession.id,
      userId: adminUser.id,
    };
    const token = await jwtService.sign(expectedJwtPayload);
    await app.request("/path", {
      headers: {
        Cookie: `jwt=${token}`,
      },
    });
    expect(jwtPayload as unknown as {}).toEqual(expectedJwtPayload);
  });

  test("should not allow to do a request with adminMiddleware while not having role admin", async () => {
    app.use(authMiddleware(authService));
    app.use(adminMiddleware(authService));

    let jwtPayload = null;
    app.get("/path", async (c) => {
      jwtPayload = c.get("jwtPayload");
    });
    const expectedJwtPayload: JwtPayload = {
      sessionId: userUserSession.id,
      userId: userUser.id,
    };
    const token = await jwtService.sign(expectedJwtPayload);
    const res = await app.request("/path", {
      headers: {
        Cookie: `jwt=${token}`,
      },
    });
    expect(res.status).toBe(302);
  });
});
