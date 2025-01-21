"use server";

import { prisma } from "@/db/prisma";

export async function updateOriginalPrice(productId: string, originalPrice: number | null) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return { error: "Този продукт не е намерен" };
  }

  let finalPrice = product.sellingPrice ? product.sellingPrice : Number(originalPrice);

  if (product.deliveryPrice) {
    finalPrice += product.deliveryPrice;
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      originalPrice,
      finalPrice,
    },
  });

  return { product: updatedProduct, message: "Цената е обновена успешно" };
}

export async function updateSellingPrice(productId: string, sellingPrice: number | null) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return { error: "Този продукт не е намерен" };
  }

  if (product.originalPrice && sellingPrice && sellingPrice >= product.originalPrice) {
    return { error: "Оригиналната цена трябва да бъде по-висока от промоционалната" };
  }

  let finalPrice = sellingPrice ? sellingPrice : Number(product.originalPrice);

  if (product.deliveryPrice) {
    finalPrice += product.deliveryPrice;
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      sellingPrice,
      finalPrice,
    },
  });

  return { product: updatedProduct, message: "Цената е обновена успешно" };
}

export async function updateDeliveryPrice(productId: string, deliveryPrice: number | null) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return { error: "Този продукт не е намерен" };
  }

  let finalPrice = product.sellingPrice ? product.sellingPrice : Number(product.originalPrice);

  if (deliveryPrice) {
    finalPrice += deliveryPrice;
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      deliveryPrice,
      finalPrice,
    },
  });

  return { product: updatedProduct };
}