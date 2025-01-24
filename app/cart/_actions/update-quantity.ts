"use server";

import { getCartItems } from "@/app/cart/_actions/helper";
import { saveSession } from "@/lib/session";

export default async function updateQuantity(productId: string, quantity: number) {
  const cartItems = await getCartItems();
  const cartItem = cartItems.find((x) => x.productId === productId);

  if (cartItem) {
    cartItem.quantity = quantity;
    await saveSession("cart", JSON.stringify(cartItems));
  }
}