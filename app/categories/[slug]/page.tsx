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
    title: category.name,
    description: category.metaDescription || "",
    keywords: category.metaKeywords,
    openGraph: {
      title: category.name,
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

  return (
    <div className="container mx-auto">
      <ClientPage category={category} />
    </div>
  );
}
