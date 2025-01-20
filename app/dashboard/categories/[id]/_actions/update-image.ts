"use server";

import { utapi } from "@/app/dashboard/server/uploadthing";
import { prisma } from "@/db/prisma";

interface UploadThingImageResponse {
  size: number;
  type: string;
  key: string;
  url: string;
}

export async function uploadImage(id: string, imageResponse: UploadThingImageResponse) {
  const foundedByIdCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!foundedByIdCategory) {
    return { error: "Този категория не е намерена" };
  }

  if (foundedByIdCategory.imageUrl) {
    const image = await prisma.image.findFirst({
      where: { url: foundedByIdCategory.imageUrl }
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

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      imageUrl: imageResponse.url,
    },
  });

  return { updatedCategory, message: "Снимката беше запазена успешно" };
}

export async function deleteImageByCategoryId(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  
  if (!category) {
    return { error: "Тази категория не е намерена" };
  }

  if (!category.imageUrl) {
    return { error: "Тази категория няма предна снимка" };
  }

  const image = await prisma.image.findFirst({
    where: { url: category.imageUrl }
  });

  if (!image) {
    return { error: "Тази категория няма предна снимка" };
  }

  await utapi.deleteFiles([image.key]);

  const updatedProduct = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      imageUrl: null,
    }
  });

  return { updatedProduct, message: "Снимката беше изтрита успешно" };
}