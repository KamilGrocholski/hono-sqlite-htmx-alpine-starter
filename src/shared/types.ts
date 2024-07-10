import { JwtPayload } from "@/jwt";

export type AppContext = {
  Variables: {
    jwtPayload: JwtPayload;
  };
};
