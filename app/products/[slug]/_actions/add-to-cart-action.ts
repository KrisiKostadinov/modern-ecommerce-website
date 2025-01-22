"use server";

import { prisma } from "@/db/prisma";
import { getSession, saveSession } from "@/lib/session";

export interface CartItem {
  productId: string;
  quantity: number;
}

export async function addToCartAction(productId: string, quantity: number) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return { error: "Продуктът не беше намерен" };
  }

  if (product.quantity < quantity) {
    return { error: "Няма достатъчно налично количество" };
  }

  const session = ((await getSession("cart")) as CartItem[]) || [];

  const cartItem = session.find((x) => x.productId === productId);

  if (!cartItem) {
    const data: CartItem[] = [
      ...session,
      {
        productId,
        quantity,
      },
    ];
    await saveSession("cart", JSON.stringify(data));
  } else {
    const data: CartItem[] = session.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    await saveSession("cart", JSON.stringify(data));
  }

  return { message: "Продуктът беше добавен в кошницата" };
}