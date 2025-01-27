import { Metadata } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import ClientPage from "@/app/products/[slug]/_components/client-page";
import { getCartItems } from "@/app/cart/_actions/helper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return null;
  }

  return {
    title: `${product.name} - ${process.env.WEBSITE_TITLE}`,
    description: product.metaDescription || "",
    keywords: product.metaKeywords || "",
    product: {
      brand: process.env.WEBSITE_TITLE,
      name: product.name,
      description: product.metaDescription || "",
      offers: {
        price: product.originalPrice,
        priceCurrency: "BGN",
        availability: "InStock",
        url: process.env.NEXT_PUBLIC_SITE_URL + "/products/" + product.slug,
        seller: {
          name: process.env.WEBSITE_TITLE,
        },
      },
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL + "/products/" + product.slug,
    },
    category: "product",
    robots: "index, follow",
    creator: process.env.WEBSITE_TITLE,
    publisher: process.env.WEBSITE_TITLE,
    classification: "product",
    openGraph: {
      title: product.name + " - " + process.env.WEBSITE_TITLE,
      description: product.metaDescription || "",
      type: "article",
      images: [
        {
          url: product.thumbnailImage || "/default-thumbnail.jpg",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "bg_BG",
      siteName: process.env.WEBSITE_TITLE,
      countryName: "България",
      url: process.env.NEXT_PUBLIC_SITE_URL + "/products/" + product.slug,
      publishedTime: product.createdAt.toISOString(),
      determiner: "auto",
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
  const cartItems = await getCartItems();

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return redirect("/");
  }

  const productCategories = await prisma.category.findMany({
    where: {
      id: {
        in: product.categoryIds,
      },
    },
  });

  return (
    <main className="min-h-screen container mx-auto">
      <ClientPage
        product={product}
        cartItems={cartItems}
        productCategories={productCategories}
      />
    </main>
  );
}