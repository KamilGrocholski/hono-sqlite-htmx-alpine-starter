import { MiddlewareHandler } from "hono";

import { AuthService } from "./service";
import { UserRole } from "@/user";

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
      return await next();
    } catch (err) {
      return c.redirect("/500");
    }
  };
}

export function adminMiddleware(authService: AuthService): MiddlewareHandler {
  return async function (c, next) {
    try {
      const jwtPayload = c.get("jwtPayload");
      const isAdmin = await authService.verifyRole(
        jwtPayload.userId,
        UserRole.Admin,
      );
      if (!isAdmin) {
        return c.redirect("/403");
      }
      return await next();
    } catch (err) {
      return c.redirect("/500");
    }
  };
}
