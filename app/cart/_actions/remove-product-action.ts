"use server";

import { getCartItems } from "@/app/cart/_actions/helper";
import { saveSession } from "@/lib/session";

export default async function removeProduct(productId: string) {
  const cartItems = await getCartItems();
  const cartProduct = cartItems.find((x) => x.productId === productId);
  const filteredCartItems = cartItems.filter((x) => x.productId !== productId);

  await saveSession("cart", JSON.stringify(filteredCartItems));

  if (!cartProduct) {
    return { error: "Този продукт не е намерен" };
  }

  return { success: "Продуктът беше премахнат от кошницата" };
}
