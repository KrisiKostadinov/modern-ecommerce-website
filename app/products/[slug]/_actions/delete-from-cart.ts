"use server";

import { getSession, saveSession } from "@/lib/session";

export default async function deleteAction(productId: string) {
  const cartItems = await getSession("cart");

  const filteredItems = cartItems.filter((x) => x.productId !== productId);
  saveSession("cart", JSON.stringify(filteredItems));
}