import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCartItems } from "@/app/cart/_actions/helper";
import ClientPage from "@/app/order/_components/client-page";
import { getUserDeliveryData } from "@/app/order/_actions/helper";

export const metadata: Metadata = {
  title: "Завършване на поръчката - Подаръ усмивка",
}

export default async function Order() {
  const cartItems = await getCartItems();
  const userDeliveryData = await getUserDeliveryData();

  if (cartItems.length === 0) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto max-sm:px-5">
      <h1 className="text-2xl font-semibold my-5">Поръчка</h1>
      <ClientPage userDeliveryData={userDeliveryData} />
    </div>
  );
}
