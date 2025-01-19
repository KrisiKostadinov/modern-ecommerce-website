import { Metadata } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import ClientPage from "./_components/client-page";

type CategoryProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: CategoryProps) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug[0];

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "Category not found",
      description: "The category you are looking for does not exist.",
    };
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

export default async function CategoryPage({ params }: CategoryProps) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug[0];

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