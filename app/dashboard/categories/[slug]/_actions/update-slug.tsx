"use server";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/dashboard/categories/[slug]/_components/update-slug";

export default async function updateSlugAction(
  id: string,
  values: FormSchemaProps
) {
  const foundedBySlugCategory = await prisma.category.findUnique({
    where: { slug: values.slug },
  });

  if (foundedBySlugCategory && foundedBySlugCategory.id !== id) {
    return { error: "Този URL адрес вече е зает от друга категория" };
  }

  const foundedByIdCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!foundedByIdCategory) {
    return { error: "Този категория не е намерена" };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      slug: values.slug,
    },
  });

  return { updatedCategory, message: "Категорията беше създадена редактирана" };
}