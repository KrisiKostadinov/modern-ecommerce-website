import { prisma } from "@/db/prisma";

import Header from "@/app/(root)/_components/header";
import DisplayCategories from "@/app/(root)/_components/categories";

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: {
      places: {
        has: "HOME_PAGE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });

  return (
    <>
      <Header />
      <DisplayCategories categories={categories} />
    </>
  );
}
