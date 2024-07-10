import { describe, test, expect, beforeEach } from "bun:test";
import { Hono } from "hono";

import { jwtMiddleware } from "./middleware";
import { JwtPayload, JwtService } from "./service";

describe("Jwt middleware", async () => {
  let app: Hono;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService("jwt", 15, "secret");
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
    expect(jwtPayload as unknown as {}).toEqual(expectedJwtPayload);
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
