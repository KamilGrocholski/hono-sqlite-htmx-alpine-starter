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
    private cookieExpMinutes: number,
    private secret: string,
  ) {}

  async sign(payload: JwtPayload): Promise<string> {
    return await sign(payload, this.secret);
  }

  async verify(token: string): Promise<JwtPayload> {
    return (await verify(token, this.secret)) as JwtPayload;
  }

  setCookie(c: Context<AppContext>, token: string): void {
    setCookie(c, this.cookieName, token, {
      sameSite: "Lax",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * this.cookieExpMinutes),
    });
  }

  deleteCookie(c: Context<AppContext>): string | undefined {
    return deleteCookie(c, this.cookieName);
  }

  getCookie(c: Context<AppContext>): string | undefined {
    return getCookie(c, this.cookieName);
  }
}
