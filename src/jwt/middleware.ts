import { MiddlewareHandler } from "hono";

import { JwtService } from "./service";

export function jwtMiddleware(jwtService: JwtService): MiddlewareHandler {
  return async function (c, next) {
    try {
      const token = jwtService.getCookie(c);
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
