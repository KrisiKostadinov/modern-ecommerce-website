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

  const cartItems = await getSession("cart");
  const cartItem = cartItems.find((x) => x.productId === productId);

  if (cartItem) {
    cartItem.quantity = quantity;
    await saveSession("cart", JSON.stringify(cartItems));
  } else {
    const data: CartItem[] = [
      {
        productId,
        quantity,
      },
      ...cartItems,
    ];

    await saveSession("cart", JSON.stringify(data));
  }

  return { message: "Продуктът беше добавен в кошницата" };
}
