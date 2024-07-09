// TODO
// make better error checking - vi
// dunno how is works
export class PublicError extends Error {
  static SomethingWentWrong = new PublicError("Something went wrong");

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PublicError";
  }

  static is(err: unknown): err is PublicError {
    return err instanceof PublicError;
  }

  static isExact(err: unknown): err is PublicError {
    return Object.getPrototypeOf(err) === PublicError.prototype;
  }

  check(err: unknown): PublicError | undefined {
    return PublicError.is(err) && err === this ? this : undefined;
  }
}
