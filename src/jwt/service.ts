import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

import { User } from "@/user";
import { Session } from "@/session";
import { AppContextEnv } from "@/types";

export type JwtPayload = {
  userId: User["id"];
  sessionId: Session["id"];
};

export class JwtService {
  constructor(
    private generateExpiresAt: () => number,
    private cookieName: string,
    private secret: string,
  ) {}

  async sign(payload: JwtPayload): Promise<string> {
    return await sign(
      {
        userId: payload.userId,
        sessionId: payload.sessionId,
        exp: this.generateExpiresAt(),
      },
      this.secret,
    );
  }

  async verify(token: string): Promise<JwtPayload> {
    return (await verify(token, this.secret)) as JwtPayload;
  }

  setCookie(c: Context<AppContextEnv>, token: string): void {
    setCookie(c, this.cookieName, token, {
      sameSite: "Lax",
      httpOnly: true,
    });
  }

  deleteCookie(c: Context<AppContextEnv>): string | undefined {
    return deleteCookie(c, this.cookieName);
  }

  getCookie(c: Context<AppContextEnv>): string | undefined {
    return getCookie(c, this.cookieName);
  }
}
