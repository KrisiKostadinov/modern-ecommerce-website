import { redirect } from "next/navigation";
import { Metadata } from "next";

import { prisma } from "@/db/prisma";
import { Product } from "@prisma/client";

import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/products/[slug]/_components/client-page";

import UpdateName from "@/app/dashboard/products/[slug]/_components/update-name";
import UpdateSlug from "@/app/dashboard/products/[slug]/_components/update-slug";
import UpdateDescription from "@/app/dashboard/products/[slug]/_components/update-description";
import UpdateOriginalPrice from "@/app/dashboard/products/[slug]/_components/update-original-price";
import UpdateSellingPrice from "@/app/dashboard/products/[slug]/_components/update-selling-price";
import UploadImage from "@/app/dashboard/products/[slug]/_components/update-image";
import UploadImages from "@/app/dashboard/products/[slug]/_components/update-images";

export const metadata: Metadata = {
  title: "Продукти",
};

export default async function UpdateProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  let product: Product | null = null;

  const isNew = awaitedParams.slug === "create";
  const heading = isNew ? "Добавяне" : "Редактиране";

  if (awaitedParams.slug && !isNew) {
    product = await prisma.product.findUnique({
      where: { id: awaitedParams.slug },
    });
  }

  if (!product && !isNew) {
    return redirect("/dashboard/products");
  }

  const mapedId = product?.id || null;
  const mapedName = product?.name || null;

  return (
    <PageWrapper>
      <ClientPage heading={heading} prodcutId={product?.id} />

      <div className="grid md:grid-cols-2 gap-5">
        <UpdateName id={mapedId} name={mapedName} />
        {product && <UpdateSlug id={mapedId} slug={product.slug} />}
      </div>

      <div className="mt-5">
        {product && (
          <UpdateDescription id={mapedId} description={product.description} />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5 my-5">
        {product && (
          <UpdateOriginalPrice
            productId={product.id}
            originalPrice={product.originalPrice}
            sellingPrice={product.sellingPrice}
            deliveryPrice={product.deliveryPrice}
            finalPrice={product.finalPrice}
          />
        )}
        {product && (
          <UpdateSellingPrice
            productId={product.id}
            sellingPrice={product.sellingPrice}
          />
        )}
      </div>

      <div className="mb-5">
        {product && (
          <UploadImage id={product.id} imageUrl={product.thumbnailImage} />
        )}
      </div>

      <div className="my-5">
        {product && <UploadImages id={product.id} imageUrls={product.images} />}
      </div>
    </PageWrapper>
  );
}