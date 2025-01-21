"use server";

import { prisma } from "@/db/prisma";

export default async function updateMetaTitle(
  productId: string,
  metaTitle: string | null,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return { error: "Този продукт не е намерен" };
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      metaTitle,
    },
  });

  return { updatedProduct, message: "Продуктът е обновен успешно" };
}
