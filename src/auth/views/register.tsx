export function RegisterPage() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}

export function RegisterForm({
  formValues,
  formErrors,
  globalError,
}: {
  formValues?: { email?: string; password?: string; confirmPassword?: string };
  formErrors?: { email?: string; password?: string; confirmPassword?: string };
  globalError?: string;
}) {
  return <div></div>;
}
