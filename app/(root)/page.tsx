import Link from "next/link";
import { Metadata } from "next";

import { prisma } from "@/db/prisma";
import Header from "@/app/(root)/_components/header";
import DisplayCategories from "@/app/(root)/_components/display-categories";
import { DisplayProductsWrapper } from "../categories/[slug]/_components/display-products-wrapper";

export const metadata: Metadata = {
  title: `${process.env.WEBSITE_SLOGUN} - ${process.env.WEBSITE_TITLE}`,
};

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

  const lastProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <main className="min-h-screen">
      <Header />
      <h2 className="text-2xl font-semibold my-5 text-center">Категории</h2>
      <DisplayCategories categories={categories} />

      <Link href={"/categories"} className="container mx-auto bg-white block w-full py-10 text-2xl font-semibold text-center border shadow">
        Преглед на всички
      </Link>

      <h2 className="text-2xl font-semibold my-5 text-center">
        Последни предложения
      </h2>

      <DisplayProductsWrapper products={lastProducts} />
    </main>
  );
}
