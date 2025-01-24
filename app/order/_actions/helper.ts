"use server";

import { getSession } from "@/lib/session";

export type UserDeliveryData = {
  fullname: string;
  email: string;
  deliveryCity: string;
  deliveryAddress: string;
  phoneNumber: string;
};

export const getUserDeliveryData = async () => {
  const decrypted = await getSession("user_delivery_data");

  if (decrypted && decrypted.payload && typeof decrypted.payload === "object") {
    return JSON.parse((decrypted.payload as { data: string }).data) as UserDeliveryData;
  }

  return null;
};
