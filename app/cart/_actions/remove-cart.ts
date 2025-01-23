"use server";

import { deleteSession } from "@/lib/session";

export default async function removeCart() {
  await deleteSession("cart");
}