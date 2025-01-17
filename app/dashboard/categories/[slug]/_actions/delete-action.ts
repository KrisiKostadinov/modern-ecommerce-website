"use server";

import { prisma } from "@/db/prisma";

export default async function deleteAction(id?: string) {
  if (!id) {
    return { error: "Тази категория не е намерена" };
  }

  const deletedCategory = await prisma.category.delete({
    where: { id },
  });

  if (!deletedCategory) {
    return { error: "Тази категория не е намерена" };
  }

  return { message: "Категорията беше изтрита успешно" };
}
