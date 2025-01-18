"use server";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/dashboard/categories/[slug]/_components/update-description";

export default async function updateSlugAction(
  id: string,
  values: FormSchemaProps
) {
  const foundedByIdCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!foundedByIdCategory) {
    return { error: "Този категория не е намерена" };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      description: values.description,
    },
  });

  return { updatedCategory, message: "Категорията беше създадена редактирана" };
}