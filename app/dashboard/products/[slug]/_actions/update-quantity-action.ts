"use server";

import { prisma } from "@/db/prisma";

export default async function updateQuantityAction(
  id: string,
  quantity: number | null
) {
  const foundedByIdProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!foundedByIdProduct) {
    return { error: "Този продукт не е намерен" };
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      quantity: quantity !== null ? quantity : undefined,
    },
  });

  return { updatedProduct, message: "Продуктът беше създаден успешно" };
}
