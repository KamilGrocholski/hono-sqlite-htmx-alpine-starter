import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

import { User } from "@/user";
import { Session } from "@/session";
import { AppContext } from "@/types";

export type JwtPayload = {
  userId: User["id"];
  sessionId: Session["id"];
};

export class JwtService {
  constructor(
    private cookieName: string,
    private jwtExpMinutes: number,
    private secret: string,
  ) {}

  async sign(payload: JwtPayload): Promise<string> {
    return await sign(
      {
        userId: payload.userId,
        sessionId: payload.sessionId,
        exp: Math.floor((Date.now() / 1000) * 60 * this.jwtExpMinutes),
      },
      this.secret,
    );
  }

  async verify(token: string): Promise<JwtPayload> {
    return (await verify(token, this.secret)) as JwtPayload;
  }

  setCookie(c: Context<AppContext>, token: string): void {
    setCookie(c, this.cookieName, token, {
      sameSite: "Lax",
      httpOnly: true,
    });
  }

  deleteCookie(c: Context<AppContext>): string | undefined {
    return deleteCookie(c, this.cookieName);
  }

  getCookie(c: Context<AppContext>): string | undefined {
    return getCookie(c, this.cookieName);
  }
}
