import { prisma } from "@/db/prisma";

import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/(root)/client-page";

export default async function Dashboard() {
  const productsCount = await prisma.product.count();
  const categoriesCount = await prisma.category.count();

  return (
    <PageWrapper>
      <ClientPage
        productsCount={productsCount}
        categoriesCount={categoriesCount}
      />
    </PageWrapper>
  );
}
