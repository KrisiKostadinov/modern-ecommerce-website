import { prisma } from "@/db/prisma";
import DisplayCategories from "@/app/(root)/_components/display-categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Категории - ${process.env.WEBSITE_TITLE}`,
}

export default async function Categories() {
  const categories = await prisma.category.findMany({
    where: {
      places: {
        has: "CATEGORIES_PAGE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen container mx-auto">
      <h1 className="mt-5 text-2xl text-center font-semibold">Категории</h1>
      <DisplayCategories categories={categories} />
    </main>
  );
}