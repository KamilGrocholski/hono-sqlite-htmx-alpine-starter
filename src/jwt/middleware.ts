import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";

import { JwtService } from "./service";

export const AUTH_JWT_COOKIE_NAME = "jwt" as const

export function jwtMiddleware(jwtService: JwtService): MiddlewareHandler {
  return async function (c, next) {
    try {
      const token = getCookie(c, AUTH_JWT_COOKIE_NAME);
      if (token) {
        const jwtPayload = await jwtService.verify(token);
        c.set("jwtPayload", jwtPayload);
      } else {
        c.set("jwtPayload", null);
      }
    } catch (err) {
      c.set("jwtPayload", null);
    }
    return await next();
  };
}
