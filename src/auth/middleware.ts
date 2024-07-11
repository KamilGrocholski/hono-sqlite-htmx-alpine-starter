import { MiddlewareHandler } from "hono";

import { UserRole } from "@/user";
import { AppContext } from "@/types";
import { AuthService } from "./service";

export function unauthOnlyMiddleware(): MiddlewareHandler {
  return async function (c, next) {
    const jwtPayload = c.get("jwtPayload");
    if (jwtPayload) {
      return c.redirect("/panel");
    }
    return await next();
  };
}

export function authOnlyMiddleware(
  authService: AuthService,
): MiddlewareHandler {
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

export function adminOnlyMiddleware(
  authService: AuthService,
): MiddlewareHandler<AppContext> {
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
