"use server";

import { prisma } from "@/db/prisma";

export default async function uploadImage(id: string, imageUrl: string) {
  const foundedByIdProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!foundedByIdProduct) {
    return { error: "Този продукт не е намерен" };
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      thumbnailImage: imageUrl,
    },
  });

  return { updatedProduct, message: "Снимката беше запазена успешно" };
}