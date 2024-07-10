import { z } from "zod";

import { userSchema } from "@/user";

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});
export type LoginSchemaErrors = z.inferFormattedError<typeof loginSchema>;

export const registerSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    confirmPassword: z.string(),
    areTermsOfServiceAccepted: z
      .unknown()
      .default(false)
      .transform((v) => Boolean(v))
      .refine((value) => value === true, {
        message: "You must accept the terms of service",
      }),
  })
  .refine((ctx) => ctx.password === ctx.confirmPassword, {
    message: "Passwords are not the same",
    path: ["confirmPassword"],
  });
export type RegisterSchemaErrors = z.inferFormattedError<typeof registerSchema>;