import { PublicError } from "@/errors";

export class AuthPublicError extends PublicError {
  static UserNotFound = new AuthPublicError("User not found");
  static EmailTaken = new AuthPublicError("Email is already taken");
  static EmailDoesNotExist = new AuthPublicError(
    "User with such e-mail does not exist",
  );
  static PasswordInvalid = new AuthPublicError("Password is invalid");

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  static isExact(err: unknown): err is AuthPublicError {
    return Object.getPrototypeOf(err) === AuthPublicError.prototype;
  }

  check(err: unknown): AuthPublicError | undefined {
    return err === this ? this : undefined;
  }
}
