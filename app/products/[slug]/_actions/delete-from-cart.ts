"use server";

import { getCartItems } from "@/app/cart/_actions/helper";
import { saveSession } from "@/lib/session";

export default async function deleteAction(productId: string) {
  const cartItems = await getCartItems();

  const filteredItems = cartItems.filter((x) => x.productId !== productId);
  saveSession("cart", JSON.stringify(filteredItems));
}
