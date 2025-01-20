"use server";

import { utapi } from "@/app/dashboard/server/uploadthing";
import { prisma } from "@/db/prisma";

interface UploadThingImageResponse {
  size: number;
  type: string;
  key: string;
  url: string;
}

export async function uploadImages(
  id: string,
  imagesResponse: UploadThingImageResponse[]
) {
  const foundedByIdProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!foundedByIdProduct) {
    return { error: "Този продукт не е намерен" };
  }

  if (foundedByIdProduct.images.length > 0) {
    const images = await prisma.image.findMany({
      where: { url: { in: foundedByIdProduct.images } },
    });

    const keys = images.map((image) => image.key);
    await utapi.deleteFiles(keys);
  }

  const imagesData = imagesResponse.map((x) => ({
    key: x.key,
    size: x.size,
    type: x.type,
    url: x.url,
  }));

  const imageUrls = imagesData.map((x) => x.url);

  await prisma.image.createMany({ data: imagesData });

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      images: imageUrls,
    },
  });

  return { updatedProduct, message: "Снимките бяха запазени успешно" };
}

export async function deleteImagesByProductId(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return { error: "Този продукт не е намерен" };
  }

  if (product.images.length === 0) {
    return { error: "Този продукт няма допълнителни снимки" };
  }

  const images = await prisma.image.findMany({
    where: { url: { in: product.images } },
  });

  const keys = images.map((image) => image.key);
  await utapi.deleteFiles(keys);

  if (images.length === 0) {
    return { error: "Този продукт няма допълнителни снимки" };
  }

  await utapi.deleteFiles(keys);

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      images: [],
    },
  });

  return { updatedProduct, message: "Допълнителните снимки бяха изтрити успешно" };
}
