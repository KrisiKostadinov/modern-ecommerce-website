import AuthWrapper from "@/app/(auth)/_components/auth-wrapper";
import TheForm from "@/app/(auth)/login/_components/the-form";

export default async function Login() {
  return (
    <main className="min-h-screen">
      <AuthWrapper title="Влизане в акаунта">
        <TheForm />
      </AuthWrapper>
    </main>
  );
}