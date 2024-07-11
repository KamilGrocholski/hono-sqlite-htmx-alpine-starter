import { describe, test, expect, beforeEach } from "bun:test";

import { UserRepo, UserRepoInMemory } from "@/user";
import { SessionRepo, SessionRepoInMemory } from "@/session";
import { JwtService, jwtMiddleware } from "@/jwt";
import { AuthService } from "./service";
import { Hono } from "hono";
import { AppContext } from "@/types";
import { createAuthApp } from "./app";

describe("Auth app", async () => {
  let userRepo: UserRepo;
  let sessionRepo: SessionRepo;
  let jwtService: JwtService;
  let authService: AuthService;
  let authApp: Hono<AppContext>;

  function idGenerator() {
    let curr = 1;
    return () => curr++;
  }

  beforeEach(() => {
    jwtService = new JwtService("jwt", 15, "secret");
    userRepo = new UserRepoInMemory(idGenerator(), new Map());
    sessionRepo = new SessionRepoInMemory(idGenerator(), new Map());
    authService = new AuthService(
      () => new Date(10_000 + Date.now()),
      sessionRepo,
      userRepo,
      jwtService,
    );
    authApp = createAuthApp(authService, jwtService);
    authApp.use(jwtMiddleware(jwtService));
  });

  test("register and login", async () => {
    const credentials = { email: "email@gmail.com", password: "password123" };
    const registerFormData = new FormData();
    registerFormData.set("email", credentials.email);
    registerFormData.set("password", credentials.password);
    registerFormData.set("confirmPassword", credentials.password);
    registerFormData.set("areTermsOfServiceAccepted", "true");
    const registerRes = await authApp.request("/register", {
      method: "POST",
      body: registerFormData,
    });
    expect(registerRes.status).toBe(200);
    const user = await userRepo.findByEmail(credentials.email);
    expect(user).not.toBeNull();

    const loginFormData = new FormData();
    loginFormData.set("email", credentials.email);
    loginFormData.set("password", credentials.password);
    const loginRes = await authApp.request("/login", {
      method: "POST",
      body: loginFormData,
    });
    expect(loginRes.status).toBe(200);
    const token = loginRes.headers
      .getSetCookie()[0]
      .split(";")[0]
      .split("=")[1];
    const payload = await jwtService.verify(token);
    const session = await sessionRepo.findById(payload.sessionId);
    expect(session).not.toBeNull();
  });
});
