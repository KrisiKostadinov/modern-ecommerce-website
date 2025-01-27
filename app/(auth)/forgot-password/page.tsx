import AuthWrapper from "@/app/(auth)/_components/auth-wrapper";
import TheForm from "@/app/(auth)/forgot-password/_components/the-form";

export default async function ForgotPassword() {
  return (
    <main className="min-h-screen">
      <AuthWrapper title="Забравена парола">
        <TheForm />
      </AuthWrapper>
    </main>
  );
}