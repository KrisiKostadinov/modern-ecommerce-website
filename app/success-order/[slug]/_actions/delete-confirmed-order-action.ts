"use server";

import { deleteSession } from "@/lib/session";

export default async function deleteConfirmedOrderAction() {
    await deleteSession("confirmed_order");
}