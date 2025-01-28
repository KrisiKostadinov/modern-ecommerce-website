import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

interface ConfirmProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Confirm({ searchParams }: ConfirmProps) {
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

  await prisma.token.delete({
    where: { token: tokenParam, userId: userIdParam },
  });

  await prisma.user.update({
    where: { id: userIdParam },
    data: { emailVerified: new Date().toISOString() },
  });

  return redirect("/");
}
