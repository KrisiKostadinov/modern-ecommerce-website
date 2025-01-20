"use server";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/dashboard/products/[slug]/_components/update-description";

export default async function updateSlugAction(
  id: string,
  values: FormSchemaProps
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
      description: values.description,
    },
  });

  return { updatedProduct, message: "Продуктът беше създаден успешно" };
}
