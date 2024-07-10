import { Document } from "@/shared/views/document";

export function LoginPage() {
  return (
    <Document>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Cos!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div class="card-body">
              <LoginForm />
              <div class="text-center">
                <a class="link link-primary" href="/register">
                  Create an account
                </a>
              </div>
            </div>
          </div>
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
          className="input input-bordered placeholder-neutral w-full max-w-xs"
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
          className="input input-bordered placeholder-neutral w-full max-w-xs"
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
