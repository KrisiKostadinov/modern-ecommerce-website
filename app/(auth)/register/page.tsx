import { redirect } from "next/navigation";

import AuthWrapper from "@/app/(auth)/_components/auth-wrapper";
import TheForm from "@/app/(auth)/register/_components/the-form";
import { auth } from "@/lib/auth";

export default async function Register() {
  const session = await auth();

  if (session) {
    return redirect("/");
  }

  return (
    <AuthWrapper title="Създаване на акаунт">
      <TheForm />
    </AuthWrapper>
  );
}
