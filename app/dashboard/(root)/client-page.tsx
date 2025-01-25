"use client";

import PageHeader from "@/app/dashboard/_components/page-header";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type ClientPageProps = {
  categoriesCount: number;
  productsCount: number;
  ordersCount: number;
  totalOrders: number;
  totalAmountToday: number;
  totalAmountThisMonth: number;
};

export default function ClientPage({
  categoriesCount,
  productsCount,
  ordersCount,
  totalOrders,
  totalAmountToday,
  totalAmountThisMonth,
}: ClientPageProps) {
  return (
    <>
      <PageHeader heading="Табло" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <DisplayItemBox
          title="Оборот за днес"
          link="/dashboard/orders?status=confirmed"
          number={formatPrice(totalAmountToday) as string}
          description="Общо генерирани приходи днес."
        />
        <DisplayItemBox
          title="Оборот за месеца"
          link="/dashboard/orders?status=confirmed"
          number={formatPrice(totalAmountThisMonth) as string}
          description="Общо генерирани приходи за този месец."
        />
        <DisplayItemBox
          title="Поръчки за днес"
          link="/dashboard/orders?status=confirmed"
          number={ordersCount.toString()}
          description="Всички поръчки със статус (Завършена) днес."
        />
      </div>
      <h2 className="text-2xl font-semibold my-5">Дурги</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <DisplayItemBox
          title="Категории"
          link="/dashboard/categories"
          number={categoriesCount.toString()}
          description="Общо добавени категории в магазина."
        />
        <DisplayItemBox
          title="Продукти"
          link="/dashboard/products"
          number={productsCount.toString()}
          description="Общо добавени продукти в магазина."
        />
        <DisplayItemBox
          title="Поръчки"
          link="/dashboard/orders?status=confirmed"
          number={totalOrders.toString()}
          description="Това е общата бройка на всичките Ви поръчки."
        />
      </div>
    </>
  );
}

type DisplayItemBoxProps = {
  title: string;
  link: string;
  number: string;
  description?: string;
};

const DisplayItemBox = ({ title, link, number, description }: DisplayItemBoxProps) => {
  return (
    <Link href={link}>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <span className="text-xl">{title}</span>
            <h2 className="text-2xl">{number}</h2>
          </div>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
};
