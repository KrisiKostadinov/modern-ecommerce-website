import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import ClientPage from "@/app/dashboard/email-templates/_components/save-client-page";
import PageWrapper from "@/app/dashboard/_components/page-wrapper";

export default async function UpdateEmailTemplate({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const emailTemplate = await prisma.emailTemplate.findUnique({
    where: { id: slug },
  });

  if (!emailTemplate) {
    return redirect("/email-templates");
  }

  return (
    <PageWrapper>
      <ClientPage emailTemplate={emailTemplate} />
    </PageWrapper>
  );
}
