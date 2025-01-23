import { Metadata } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import ClientPage from "@/app/categories/[slug]/_components/client-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return null;
  }

  return {
    title: "Подадърци за " + category.name + " - Подари усмивка",
    description: category.metaDescription || "",
    keywords: category.metaKeywords || "",
    openGraph: {
      title: "Подадърци за " + category.name + " - Подари усмивка",
      description: category.metaDescription || "",
    },
  } as Metadata;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return redirect("/categories");
  }

  const products = await prisma.product.findMany({
    where: { categoryIds: { hasSome: [category.id] } },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <div className="container mx-auto">
      <ClientPage category={category} products={products} />
    </div>
  );
}
