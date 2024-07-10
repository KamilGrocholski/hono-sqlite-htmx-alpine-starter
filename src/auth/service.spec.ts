import { describe, test, expect, beforeEach } from "bun:test";

import { UserRepo, UserRepoInMemory } from "@/user";
import { SessionRepo, SessionRepoInMemory } from "@/session";
import { JwtService } from "@/jwt";
import { AuthService } from "./service";

describe("Auth service", async () => {
  let userRepo: UserRepo;
  let sessionRepo: SessionRepo;
  let jwtService: JwtService;
  let authService: AuthService;

  function idGenerator() {
    let curr = 1;
    return () => {
      return curr++;
    };
  }

  beforeEach(() => {
    jwtService = new JwtService("jwt", 15, "secret");
    userRepo = new UserRepoInMemory(idGenerator(), new Map());
    sessionRepo = new SessionRepoInMemory(idGenerator(), new Map());
    authService = new AuthService(
      () => new Date(1000 + Date.now()),
      sessionRepo,
      userRepo,
      jwtService,
    );
  });

  test("register, login and verify session", async () => {
    const email = "email@gmail.com";
    const password = "password";
    await authService.registerUser(email, password);
    const token = await authService.login(email, password);
    const payload = await jwtService.verify(token);
    const isSessionValid = await authService.verifySession(payload.sessionId);
    expect(isSessionValid).toBeTrue();
  });
});
