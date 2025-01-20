"use server";

import { prisma } from "@/db/prisma";
import { utapi } from "@/app/dashboard/server/uploadthing";

interface UploadThingImageResponse {
  size: number;
  type: string;
  key: string;
  url: string;
}

export async function uploadImage(id: string, imageResponse: UploadThingImageResponse) {
  const foundedByIdProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!foundedByIdProduct) {
    return { error: "Този продукт не е намерен" };
  }

  if (foundedByIdProduct.thumbnailImage) {
    const image = await prisma.image.findFirst({
      where: { url: foundedByIdProduct.thumbnailImage }
    });
  
    if (image) {
      await utapi.deleteFiles([image.key]);
    }
  }

  await prisma.image.create({
    data: {
      key: imageResponse.key,
      type: imageResponse.type,
      size: imageResponse.size,
      url: imageResponse.url,
    }
  });

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      thumbnailImage: imageResponse.url,
    },
  });

  return { updatedProduct, message: "Снимката беше запазена успешно" };
}

export async function deleteImageByProductId(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  
  if (!product) {
    return { error: "Този продукт не е намерен" };
  }

  if (!product.thumbnailImage) {
    return { error: "Този продукт няма предна снимка" };
  }

  const image = await prisma.image.findFirst({
    where: { url: product.thumbnailImage }
  });

  if (!image) {
    return { error: "Този продукт няма предна снимка" };
  }

  await utapi.deleteFiles([image.key]);

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      thumbnailImage: null,
    }
  });

  return { updatedProduct, message: "Снимката беше изтрита успешно" };
}