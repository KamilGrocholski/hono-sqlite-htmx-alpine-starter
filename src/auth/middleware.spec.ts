import { describe, test, expect, beforeEach } from "bun:test";
import { Hono } from "hono";
import { JWTPayload } from "hono/utils/jwt/types";

import { JwtPayload, JwtService, jwtMiddleware } from "@/jwt";
import { Session, SessionRepo, SessionRepoInMemory } from "@/session";
import { User, UserRepo, UserRepoInMemory, UserRole } from "@/user";
import { adminOnlyMiddleware, authOnlyMiddleware } from "./middleware";
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const adminUserSession: Session = {
    id: 1,
    userId: adminUser.id,
    expiresAt: new Date(Date.now() + 10_000),
    createdAt: new Date(),
  };

  const userUser: User = {
    id: 2,
    email: "user@gmail.com",
    password: "Haslo1234",
    role: UserRole.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userUserSession: Session = {
    id: 2,
    userId: userUser.id,
    expiresAt: new Date(Date.now() + 100_000),
    createdAt: new Date(),
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
    jwtService = new JwtService(
      function generateJwtExpiresAt() {
        return Math.floor((Date.now() / 1000) * 60 * 15);
      },
      "jwt",
      "secret",
    );
    authService = new AuthService(
      () => new Date(Date.now() + 100_000),
      sessionRepo,
      userRepo,
      jwtService,
    );
    app = new Hono();
    app.use(jwtMiddleware(jwtService));
  });

  test("should verify role admin and finish the request successfully", async () => {
    app.use(authOnlyMiddleware(authService));
    app.use(adminOnlyMiddleware(authService));

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
    expect(jwtPayload as unknown as JWTPayload & JwtPayload).toSatisfy((v) => {
      return (
        v.sessionId === expectedJwtPayload.sessionId &&
        v.userId === expectedJwtPayload.userId
      );
    });
  });

  test("should not allow to do a request with adminMiddleware while not having role admin", async () => {
    app.use(authOnlyMiddleware(authService));
    app.use(adminOnlyMiddleware(authService));

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
