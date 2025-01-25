"use server";

import { prisma } from "@/db/prisma";
import { OrderStatus } from "@prisma/client";

export default async function updateStatus(
  orderId: string,
  status: OrderStatus
) {
    console.log(status);
    
  const updatedProduct = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  if (!updatedProduct) {
    return { error: "Тази пъръчка не е намерена" };
  }

  return { message: "Статусът на пъръчката беше успешно променен" };
}