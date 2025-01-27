import { prisma } from "@/db/prisma";
import ClientPage from "@/app/dashboard/email-templates/_components/client-page";

export default async function EmailTemplates() {
  const emailTemplates = await prisma.emailTemplate.findMany();

  return (
    <>
      <ClientPage emailTemplates={emailTemplates} />
    </>
  );
}