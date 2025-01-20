"use server";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/dashboard/products/[slug]/_components/update-slug";

export default async function updateSlugAction(
  id: string,
  values: FormSchemaProps
) {
  const foundedBySlugProduct = await prisma.product.findUnique({
    where: { slug: values.slug },
  });

  if (foundedBySlugProduct && foundedBySlugProduct.id !== id) {
    return { error: "Този URL адрес вече е зает от друг продукт" };
  }

  const foundedByIdProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!foundedByIdProduct) {
    return { error: "Този продукт не е намерен" };
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      slug: values.slug,
    },
  });

  return { updatedProduct, message: "Продуктът беше създаден редактирана" };
}