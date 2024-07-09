import { MiddlewareHandler } from "hono";

import { AuthService } from "./service";

export function authMiddleware(authService: AuthService): MiddlewareHandler {
  return async function (c, next) {
    try {
      const jwtPayload = c.get("jwtPayload");
      if (!jwtPayload) {
        return c.redirect("/login");
      }
      const isSessionValid = await authService.verifySession(
        jwtPayload.sessionId,
      );
      if (!isSessionValid) {
        return c.redirect("/login");
      }
    } catch (err) {
      return c.redirect("/login");
    }
    return await next();
  };
}
