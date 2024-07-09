import { Document } from "@/shared/views/document";

export function LoginPage() {
  return (
    <Document>
      <div class="max-w-xs">
        <LoginForm />
        <div class="text-center">
          <a class="link link-primary" href="/register">
            Create an account
          </a>
        </div>
      </div>
    </Document>
  );
}

export function LoginForm({
  formValues,
  formErrors,
  globalError,
}: {
  formValues?: { email?: string; password?: string };
  formErrors?: { email?: string; password?: string };
  globalError?: string;
}) {
  return (
    <form hx-post="/login" hx-swap="outerHTML">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">E-mail</span>
        </div>
        <input
          type="text"
          name="email"
          value={formValues?.email}
          placeholder="email@gmail.com"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label">
          <span className="label-text text-error">{formErrors?.email}</span>
        </div>
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <input
          type="password"
          name="password"
          value={formValues?.password}
          placeholder="*****"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label">
          <span className="label-text text-error">{formErrors?.password}</span>
        </div>
      </label>

      <div class="max-w-xs">
        <button type="submit" class="btn btn-primary w-full">
          Login
        </button>
        <span class="text-error">{globalError}</span>
      </div>
    </form>
  );
}
