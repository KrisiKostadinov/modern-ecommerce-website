import { prisma } from "@/db/prisma";
import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/(root)/client-page";

export default async function Dashboard() {
  const categoriesCount = await prisma.category.count();

  return (
    <PageWrapper>
      <ClientPage categoriesCount={categoriesCount} />
    </PageWrapper>
  );
}
