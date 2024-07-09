export function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
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
  return <div></div>;
}
