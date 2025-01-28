import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/db/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderProduct } from "@/app/order/_actions/create-order";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Завършване на поръчката - Подаръ усмивка",
};

export default async function SuccessOrder({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const orderNumber = (await params).slug;

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: orderNumber,
      createdAt: {
        gte: fiveMinutesAgo,
      },
    },
  });

  if (!order) {
    return redirect("/");
  }

  const orderProducts = order.orderProducts as OrderProduct[];

  return (
    <main className="min-h-screen container mx-auto max-sm:px-5">
      <h1 className="text-2xl font-semibold text-center my-5">
        Поръчката е завършена
      </h1>
      <div className="bg-white border rounded-md shadow py-3 px-4">
        <div>
          <h2 className="text-xl mb-5">Подробности за доставката</h2>
          <div className="my-5 text-center bg-green-100 py-5 border border-green-200 rounded-md">
            <strong>Важно! </strong>
            <span>Доставката ще бъде направена в рамките на 3 работни дни</span>
          </div>
          <ScrollArea className="bg-white border rounded-md py-3 px-4">
            <table className="border-collapse w-full text-left min-w-[900px]">
              <thead>
                <tr>
                  <th className="border py-1 px-2">&#8470;</th>
                  <th className="border py-1 px-2">Адрес</th>
                  <th className="border py-1 px-2">Град</th>
                  <th className="border py-1 px-2">Имейл</th>
                  <th className="border py-1 px-2">Име и фамилия</th>
                  <th className="border py-1 px-2">Статус</th>
                  <th className="border py-1 px-2">Телефон</th>
                  <th className="border py-1 px-2">Сума</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border py-1 px-2">{order.orderNumber}</td>
                  <td className="border py-1 px-2">{order.deliveryCity}</td>
                  <td className="border py-1 px-2">{order.deliveryAddress}</td>
                  <td className="border py-1 px-2">{order.email}</td>
                  <td className="border py-1 px-2">{order.fullname}</td>
                  <td className="border py-1 px-2">Потвърдена</td>
                  <td className="border py-1 px-2">{order.phoneNumber}</td>
                  <td className="border py-1 px-2">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <h2 className="text-xl my-5">Поръчани продукти</h2>
          <ScrollArea className="bg-white border rounded-md py-3 px-4">
            <table className="border-collapse w-full text-left min-w-[600px]">
              <thead>
                <tr>
                  <th className="border py-1 px-2">Име</th>
                  <th className="border py-1 px-2">Цена</th>
                  <th className="border py-1 px-2">Количество</th>
                  <th className="border py-1 px-2">Цена</th>
                </tr>
              </thead>
              <tbody>
                {orderProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="border py-1 px-2">{product.name}</td>
                    <td className="border py-1 px-2">
                      {formatPrice(product.price)}
                    </td>
                    <td className="border py-1 px-2">
                      {product.quantity}{" "}
                      {product.quantity === 1 ? "брой" : "броя"}
                    </td>
                    <td className="border py-1 px-2">
                      {formatPrice(product.quantity * product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="mt-3 flex justify-center">
          <Link href={"/categories"}>
            <Button size={"lg"}>Обравно към магазина</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}