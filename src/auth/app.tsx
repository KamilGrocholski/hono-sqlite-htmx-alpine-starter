import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import { zValidator } from "@hono/zod-validator";

import { AUTH_JWT_COOKIE_NAME } from "@/jwt";
import { PublicError } from "@/shared";
import { AuthService } from "./service";
import { LoginForm, LoginPage, RegisterForm, RegisterPage } from "./views";
import {
  LoginSchemaErrors,
  RegisterSchemaErrors,
  loginSchema,
  registerSchema,
} from "./types";
import { AuthPublicError } from "./errors";
import { ConfigService } from "@/config";

export function authApp(
  configService: ConfigService,
  authService: AuthService,
) {
  const app = new Hono();

  app.get("/register", (c) => c.html(<RegisterPage />));

  app.get("/login", (c) => c.html(<LoginPage />));

  app.delete("/logout", async (c) => {
    try {
      const jwtPayload = c.get("jwtPayload");
      if (!jwtPayload) return;
      await authService.logout(jwtPayload.sessionId);
      c.res.headers.set("HX-Location", "/");
      deleteCookie(c, AUTH_JWT_COOKIE_NAME);
      return c.html("ok");
    } catch (err) {
      // TODO
    }
  });

  app.post(
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
            <RegisterPage
              formValues={formValues}
              globalError={PublicError.SomethingWentWrong.message}
            />,
          );
        }
        return c.html(
          <RegisterPage
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

  app.post(
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
        setCookie(c, AUTH_JWT_COOKIE_NAME, token, {
          sameSite: "Lax",
          httpOnly: true,
          expires: new Date(
            Date.now() + 1000 * 60 * configService.env.JWT_EXP_MINUTES,
          ),
        });
        c.res.headers.set("HX-Redirect", "/panel");
        return c.html("ok");
      } catch (err) {
        if (!PublicError.is(err)) {
          return c.html(
            <LoginForm
              formValues={formValues}
              globalError={PublicError.SomethingWentWrong.message}
            />,
          );
        }
        return c.html(
          <LoginForm
            formValues={formValues}
            formErrors={{
              email: AuthPublicError.EmailDoesNotExist.check(err)?.message,
              password: AuthPublicError.PasswordInvalid.check(err)?.message,
            }}
            globalError={PublicError.isExact(err) ? err.message : undefined}
          />,
        );
      }
    },
  );

  return app;
}
