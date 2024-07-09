import { PublicError } from "@/shared";

export class AuthPublicError extends PublicError {
  static EmailTaken = new AuthPublicError("Email is already taken");
  static EmailDoesNotExist = new AuthPublicError(
    "User with such e-mail does not exist",
  );
  static PasswordInvalid = new AuthPublicError("Password is invalid");

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  static is(err: unknown): err is AuthPublicError {
    return err instanceof AuthPublicError;
  }

  static isExact<T extends AuthPublicError>(err: unknown, exact: T): err is T {
    return err === exact;
  }
}
