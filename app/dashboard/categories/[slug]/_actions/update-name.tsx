"use server";

import { FormSchemaProps } from "@/app/dashboard/categories/[slug]/_components/update-name";
import { prisma } from "@/db/prisma";
import { createSlug } from "@/lib/utils";

export default async function updateNameAction(
  id: string | null,
  values: FormSchemaProps
) {
  const slug = createSlug(values.name);
  
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (category) {
    return { error: "Това име вече е заето от друга категория" };
  }

  if (id) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { error: "Тази категория не е намерена" };
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: values.name, slug },
    });

    return { updatedCategory, message: "Категорията беше редактирана успешно" };
  } else {
    const slug = createSlug(values.name);

    const createdCategory = await prisma.category.create({
      data: {
        name: values.name,
        slug: slug,
      },
    });

    return { createdCategory, message: "Категорията беше създадена успешно" };
  }
}
