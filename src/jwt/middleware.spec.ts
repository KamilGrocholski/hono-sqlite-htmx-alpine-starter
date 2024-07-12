import { describe, test, expect, beforeEach } from "bun:test";
import { Hono } from "hono";
import { JWTPayload } from "hono/utils/jwt/types";

import { jwtMiddleware } from "./middleware";
import { JwtPayload, JwtService } from "./service";

describe("Jwt middleware", async () => {
  let app: Hono;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService(
      function generateJwtExpiresAt() {
        return Math.floor((Date.now() / 1000) * 60 * 15);
      },
      "jwt",
      "secret",
    );
    app = new Hono();
    app.use(jwtMiddleware(jwtService));
  });

  test("should set payload when jwt cookie exists", async () => {
    let jwtPayload = null;
    app.get("/path", async (c) => {
      jwtPayload = c.get("jwtPayload");
    });
    const expectedJwtPayload: JwtPayload = { sessionId: 1, userId: 1 };
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

  test("should set payload to null when jwt cookie does not exist", async () => {
    let jwtPayload = null;
    app.get("/path", async (c) => {
      jwtPayload = c.get("jwtPayload");
    });
    await app.request("/path");
    expect(jwtPayload).toBeNull();
  });
});
