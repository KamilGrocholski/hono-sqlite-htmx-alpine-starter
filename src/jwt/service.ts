import { sign, verify } from "hono/jwt";

import { User } from "@/user";
import { Session } from "@/session";

export type JwtPayload = {
  userId: User["id"];
  sessionId: Session["id"];
};

export class JwtService {
  constructor(private secret: string) {}

  async sign(payload: JwtPayload): Promise<string> {
    return await sign(payload, this.secret);
  }

  async verify(token: string): Promise<JwtPayload> {
    return (await verify(token, this.secret)) as JwtPayload;
  }
}
