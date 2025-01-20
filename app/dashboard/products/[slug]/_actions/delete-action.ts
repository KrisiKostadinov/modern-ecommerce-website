"use server";

import { prisma } from "@/db/prisma";

export default async function deleteAction(id?: string) {
  if (!id) {
    return { error: "Този продукт не е намерен" };
  }

  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  if (!deletedProduct) {
    return { error: "Този продукт не е намерен" };
  }

  return { message: "Продуктът беше изтрита успешно" };
}
