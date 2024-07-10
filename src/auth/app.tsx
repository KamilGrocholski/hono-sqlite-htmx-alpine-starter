import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import { JwtService } from "@/jwt";
import { PublicError } from "@/errors";
import { AppContext } from "@/types";
import { AuthService } from "./service";
import { LoginForm, LoginPage, RegisterForm, RegisterPage } from "./views";
import {
  LoginSchemaErrors,
  RegisterSchemaErrors,
  loginSchema,
  registerSchema,
} from "./types";
import { AuthPublicError } from "./errors";

export function authApp(authService: AuthService, jwtService: JwtService) {
  const authApp = new Hono<AppContext>();

  authApp.get("/register", (c) => c.html(<RegisterPage />));

  authApp.get("/login", (c) => c.html(<LoginPage />));

  authApp.delete("/logout", async (c) => {
    try {
      const jwtPayload = c.get("jwtPayload");
      if (!jwtPayload) return;
      await authService.logout(jwtPayload.sessionId);
      c.res.headers.set("HX-Location", "/");
      jwtService.deleteCookie(c);
      return c.html("ok");
    } catch (err) {
      // TODO
    }
  });

  authApp.delete("/logout-total", async (c) => {
    try {
      const jwtPayload = c.get("jwtPayload");
      if (!jwtPayload) return;
      await authService.logoutFromAllUserSessions(jwtPayload.userId);
      c.res.headers.set("HX-Location", "/");
      jwtService.deleteCookie(c);
      return c.html("ok");
    } catch (err) {
      // TODO
    }
  });

  authApp.post(
    "/register",
    zValidator("form", registerSchema, (result, c) => {
      if (!result.success) {
        const errors: RegisterSchemaErrors = result.error.format();
        return c.html(
          <RegisterForm
            formValues={result.data}
            formErrors={{
              email: errors.email?._errors[0],
              password: errors.password?._errors[0],
              confirmPassword: errors.confirmPassword?._errors[0],
              areTermsOfServiceAccepted:
                errors.areTermsOfServiceAccepted?._errors[0],
            }}
          />,
        );
      }
    }),
    async (c) => {
      const formValues = c.req.valid("form");
      try {
        await authService.registerUser(formValues.email, formValues.password);
        c.res.headers.set("HX-Redirect", "/login");
        return c.html("ok");
      } catch (err) {
        if (!PublicError.is(err)) {
          return c.html(
            <RegisterForm
              formValues={formValues}
              globalError={PublicError.SomethingWentWrong.message}
            />,
          );
        }
        return c.html(
          <RegisterForm
            formValues={formValues}
            formErrors={{
              email: AuthPublicError.EmailTaken.check(err)?.message,
            }}
            globalError={PublicError.isExact(err) ? err.message : undefined}
          />,
        );
      }
    },
  );

  authApp.post(
    "/login",
    zValidator("form", loginSchema, (result, c) => {
      if (!result.success) {
        const errors: LoginSchemaErrors = result.error.format();
        return c.html(
          <LoginForm
            formValues={result.data}
            formErrors={{
              email: errors.email?._errors[0],
              password: errors.password?._errors[0],
            }}
          />,
        );
      }
    }),
    async (c) => {
      const formValues = c.req.valid("form");
      try {
        const token = await authService.login(
          formValues.email,
          formValues.password,
        );
        jwtService.setCookie(c, token);
        c.res.headers.set("HX-Redirect", "/panel");
        return c.html("ok");
      } catch (err) {
        return c.html(
          <LoginForm
            formValues={formValues}
            globalError={
              (AuthPublicError.isExact(err) &&
                AuthPublicError.InvalidCredentials.message) ||
              PublicError.SomethingWentWrong.message
            }
          />,
        );
      }
    },
  );

  return authApp;
}
