import { PublicError } from "@/errors";

export class AuthPublicError extends PublicError {
  static InvalidCredentials = new AuthPublicError("Invalid credentials");
  static UserNotFound = new AuthPublicError("User not found");
  static EmailTaken = new AuthPublicError("Email is already taken");

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AuthPublicError";
  }

  static isExact(err: unknown): err is AuthPublicError {
    return Object.getPrototypeOf(err) === AuthPublicError.prototype;
  }

  check(err: unknown): AuthPublicError | undefined {
    return err === this ? this : undefined;
  }
}
