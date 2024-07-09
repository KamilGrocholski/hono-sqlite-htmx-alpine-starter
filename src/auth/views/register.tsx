import { Document } from "@/shared/views/document";

export function RegisterPage() {
  return (
    <Document>
      <div class="max-w-xs">
        <RegisterForm />
        <div class="text-center">
          <a class="link link-primary" href="/login">
            Already have an account
          </a>
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

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Confirm password</span>
        </div>
        <input
          type="password"
          name="confirmPassword"
          value={formValues?.confirmPassword}
          placeholder="*****"
          className="input input-bordered w-full max-w-xs"
        />
        <div className="label">
          <span className="label-text text-error">
            {formErrors?.confirmPassword}
          </span>
        </div>
      </label>

      <div class="max-w-xs">
        <label className="form-control w-full max-w-xs">
          <div class=" flex flex-row items-center">
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
