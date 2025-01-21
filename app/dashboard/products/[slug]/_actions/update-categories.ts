"use server";

import { prisma } from "@/db/prisma";

export async function updateCategories(productId: string, categoryIds: string[]) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return { error: "Този придукт не е намерен" };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      categoryIds,
    },
  });

  if (categoryIds.length === 0) {
    return { message: "Категориите бяха успешно премахнати от продукта" };
  }

  return { message: "Категориите на продукта бяха успешно обновени" };
}
