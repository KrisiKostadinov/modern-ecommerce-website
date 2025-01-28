import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

import AuthWrapper from "@/app/(auth)/_components/auth-wrapper";
import TheForm from "@/app/(auth)/password-reset/_components/the-form";

interface ConfirmProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PasswordReset({ searchParams }: ConfirmProps) {
  if (Object.keys(await searchParams).length === 0) {
    return redirect("/");
  }

  const awaitedParams = await searchParams;

  if (!awaitedParams.token || !awaitedParams.id) {
    return redirect("/");
  }

  const userIdParam = awaitedParams.id.toString();
  const tokenParam = awaitedParams.token.toString();

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const token = await prisma.token.findUnique({
    where: {
      token: tokenParam,
      userId: userIdParam,
      createdAt: {
        gte: twentyFourHoursAgo,
      },
    },
  });

  if (!token) {
    return redirect("/");
  }

  return (
    <main className="min-h-screen">
      <AuthWrapper title="Смяна на паролата">
        <TheForm token={tokenParam} id={userIdParam} />
      </AuthWrapper>
    </main>
  );
}
