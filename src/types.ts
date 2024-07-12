import { JwtPayload } from "@/jwt";

export type AppContextEnv = {
  Variables: Variables;
};

type Variables = {
  jwtPayload: JwtPayload;
  isHtmxRequest: boolean;
};
