import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import { zValidator } from "@hono/zod-validator";

import { AUTH_JWT_COOKIE_NAME } from "@/jwt";
import { PublicError } from "@/shared";
import { AuthService } from "./service";
import { LoginForm, LoginPage, RegisterForm, RegisterPage } from "./views";
import { LoginSchemaErrors, loginSchema, registerSchema } from "./types";
import { AuthPublicError } from "./errors";

export function authApp(authService: AuthService) {
  const app = new Hono();

  app.get("/register", (c) => c.html(<RegisterPage />));

  app.get("/login", (c) => c.html(<LoginPage />));

  app.post(
    "/register",
    zValidator("form", registerSchema, (result, c) => {
      if (!result.success) {
        return c.html(<RegisterForm formValues={result.data} />);
      }
    }),
    async (c) => {
      const formValues = c.req.valid("form");
      try {
        await authService.register(formValues.email, formValues.password);
        return c.redirect("/login");
      } catch (err) {
        if (AuthPublicError.isExact(err, AuthPublicError.EmailTaken)) {
          return c.html(
            <RegisterPage
              formValues={formValues}
              formErrors={{ email: err.message }}
            />,
          );
        }
        return c.html(
          <RegisterPage
            formValues={formValues}
            globalError={
              PublicError.is(err)
                ? err.message
                : PublicError.SomethingWentWrong.message
            }
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
        setCookie(c, AUTH_JWT_COOKIE_NAME, token);
        return c.redirect("/app");
      } catch (err) {
        if (AuthPublicError.isExact(err, AuthPublicError.PasswordInvalid)) {
          return c.html(
            <LoginForm
              formValues={formValues}
              formErrors={{ password: err.message }}
            />,
          );
        }
        if (AuthPublicError.isExact(err, AuthPublicError.EmailDoesNotExist)) {
          return c.html(
            <LoginForm
              formValues={formValues}
              formErrors={{ email: err.message }}
            />,
          );
        }
        return c.html(
          <LoginForm
            formValues={formValues}
            globalError={
              PublicError.is(err)
                ? err.message
                : PublicError.SomethingWentWrong.message
            }
          />,
        );
      }
    },
  );

  return app;
}
