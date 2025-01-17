import AuthWrapper from "@/app/(auth)/_components/auth-wrapper";
import TheForm from "@/app/(auth)/register/_components/the-form";

export default async function Register() {
  return (
    <AuthWrapper title="Създаване на акаунт">
      <TheForm />
    </AuthWrapper>
  );
}