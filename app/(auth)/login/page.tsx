import { redirect } from "next/navigation";

import AuthWrapper from "@/app/(auth)/_components/auth-wrapper";
import TheForm from "@/app/(auth)/login/_components/the-form";
import { auth } from "@/lib/auth";

export default async function Login() {
  const session = await auth();

  if (session) {
    return redirect("/");
  }

  return (
    <AuthWrapper title="Влизане в акаунта">
      <TheForm />
    </AuthWrapper>
  );
}
