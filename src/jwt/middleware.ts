import { MiddlewareHandler } from "hono";
import { JwtTokenExpired } from "hono/utils/jwt/types";

import { JwtService } from "./service";

export function jwtMiddleware(jwtService: JwtService): MiddlewareHandler {
  return async function (c, next) {
    let jwtPayload;
    try {
      const token = jwtService.getCookie(c);
      if (token) {
        jwtPayload = await jwtService.verify(token);
        c.set("jwtPayload", jwtPayload);
      } else {
        c.set("jwtPayload", null);
      }
    } catch (err) {
      if (err instanceof JwtTokenExpired) {
        if (jwtPayload) {
          const token = await jwtService.sign(jwtPayload);
          jwtService.setCookie(c, token);
          c.set("jwtPayload", jwtPayload);
        }
      } else {
        c.set("jwtPayload", null);
      }
    }
    return await next();
  };
}
