"use client";

import Image from "next/image";
import Link from "next/link";

import { Order } from "@prisma/client";
import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import PageHeader from "@/app/dashboard/_components/page-header";
import { OrderProductWithProduct } from "@/app/dashboard/orders/[slug]/page";
import { Card, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ClientPageProps = {
  order: Order;
  orderProductsWithProducts: OrderProductWithProduct[];
};

export default function ClientPage({
  order,
  orderProductsWithProducts,
}: ClientPageProps) {
  return (
    <PageWrapper>
      <PageHeader heading="Поръчани продукти" />
      <div className="mb-5">Номер на поръчка: {order.orderNumber}</div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-5">
            {orderProductsWithProducts.map((x, index) => (
              <div key={index} className="hover:bg-gray-100">
                <div className="flex gap-5">
                  {x.product.thumbnailImage && (
                    <div className="hidden sm:block border shadow rounded-md overflow-hidden w-[200px] h-[140px]">
                      <Image
                        src={x.product.thumbnailImage}
                        alt={x.orderProduct.name}
                        width={300}
                        height={300}
                        priority
                        className="w-full h-full object-cover"
                        title={x.orderProduct.name}
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="text-xl">{x.orderProduct.name}</div>
                      <div>
                        Количество: {x.orderProduct.quantity}{" "}
                        {x.orderProduct.quantity === 1 ? "брой" : "броя"}
                      </div>
                      <div>
                        Общо:{" "}
                        {formatPrice(
                          x.orderProduct.price * x.orderProduct.quantity
                        )}
                      </div>
                      <Link
                        href={`/dashboard/products/${x.orderProduct.id}`}
                        className="mt-5 block"
                      >
                        <Button variant={"outline"}>Към продукта</Button>
                      </Link>
                    </div>
                    <div>{formatPrice(x.orderProduct.price)}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <Link href={"/dashboard/orders?status=confirmed"}>
                <Button variant={"outline"}>Назад</Button>
              </Link>
              <div>Общо сума: {formatPrice(order.totalAmount)}</div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </PageWrapper>
  );
}