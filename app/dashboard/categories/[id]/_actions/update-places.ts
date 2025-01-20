"use server";

import { prisma } from "@/db/prisma";
import { CategoryPlace } from "@prisma/client";

export default async function updatePlaceAction(id: string, places: CategoryPlace[]) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return { error: "Тази категория не е намерена" };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      places
    }
  });

  return { message: "Местата на показване на категорията са запазени успешно", updatedCategory };
}
