import { Document } from "@/shared/views/document";

export function RegisterPage() {
  return (
    <Document>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Join us!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div class="card-body">
              <RegisterForm />
              <div class="text-center">
                <a class="link link-primary" href="/login">
                  Already have an account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Document>
  );
}

export function RegisterForm({
  formValues,
  formErrors,
  globalError,
}: {
  formValues?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    areTermsOfServiceAccepted?: boolean;
  };
  formErrors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    areTermsOfServiceAccepted?: string;
  };
  globalError?: string;
}) {
  return (
    <form hx-post="/register" hx-swap="outerHTML">
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

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Confirm password</span>
        </div>
        <input
          type="password"
          name="confirmPassword"
          value={formValues?.confirmPassword}
          placeholder="*****"
          className="input input-bordered placeholder-neutral w-full max-w-xs"
        />
        <div className="label">
          <span className="label-text text-error">
            {formErrors?.confirmPassword}
          </span>
        </div>
      </label>

      <div class="max-w-xs">
        <label className="form-control w-full max-w-xs">
          <div class=" flex flex-row items-center justify-end">
            <div className="label">
              <span className="label-text">
                <a class="link link-primary" href="/terms-of-service">
                  Terms of service
                </a>
              </span>
            </div>
            <input
              type="checkbox"
              name="areTermsOfServiceAccepted"
              checked={Boolean(formValues?.areTermsOfServiceAccepted)}
              class="checkbox checkbox-primary"
            />
          </div>
          <div className="label">
            <span className="label-text text-error">
              {formErrors?.areTermsOfServiceAccepted}
            </span>
          </div>
        </label>

        <button type="submit" class="btn btn-primary w-full">
          Register
        </button>
        <span class="text-error">{globalError}</span>
      </div>
    </form>
  );
}
