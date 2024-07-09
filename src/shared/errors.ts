export class PublicError extends Error {
  static SomethingWentWrong = new PublicError("Something went wrong");

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PublicError";
  }

  static is(err: unknown): err is PublicError {
    return err instanceof PublicError;
  }

  static isExact<T extends PublicError>(err: unknown, exact: T): err is T {
    return err === exact;
  }
}
