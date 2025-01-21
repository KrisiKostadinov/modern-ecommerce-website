"use server";

import { FormSchemaProps } from "@/app/dashboard/products/[slug]/_components/update-name";
import { prisma } from "@/db/prisma";
import { createSlug } from "@/lib/utils";

export default async function updateNameAction(
  id: string | null,
  values: FormSchemaProps
) {
  const slug = createSlug(values.name);
  
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (product) {
    return { error: "Това име вече е заето от друг продукт" };
  }

  if (id) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { error: "Този продукт не е намерен" };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name: values.name, slug },
    });

    return { updatedProduct, message: "Продуктът беше редактиран успешно" };
  } else {
    const slug = createSlug(values.name);

    const createdProduct = await prisma.product.create({
      data: {
        name: values.name,
        slug: slug,
      },
    });

    return { createdProduct, message: "Продуктът беше създаден успешно" };
  }
}
