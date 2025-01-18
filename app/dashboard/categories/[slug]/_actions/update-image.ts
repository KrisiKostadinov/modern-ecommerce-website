"use server";

import { prisma } from "@/db/prisma";

export default async function uploadImage(id: string, imageUrl: string) {
  const foundedByIdCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!foundedByIdCategory) {
    return { error: "Този категория не е намерена" };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      imageUrl,
    },
  });

  return { updatedCategory, message: "Снимката беше запазена успешно" };
}