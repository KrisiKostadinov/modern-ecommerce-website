import { prisma } from "@/db/prisma";

import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/(root)/client-page";

export default async function Dashboard() {
  const [productsCount, categoriesCount, totalOrders, ordersCount, today, month] =
    await Promise.all([
      await prisma.product.count(),
      await prisma.category.count(),
      await prisma.order.count(),
      await prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(24, 0, 0, 0)),
          },
          status: {
            equals: "CONFIRMED",
          },
        }
      }),
      await prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(24, 0, 0, 0)),
          },
          status: {
            equals: "CONFIRMED",
          },
        },
      }),
      await prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
          status: {
            equals: "CONFIRMED",
          },
        },
      }),      
    ]);

  return (
    <PageWrapper>
      <ClientPage
        productsCount={productsCount}
        categoriesCount={categoriesCount}
        ordersCount={ordersCount}
        totalAmountToday={today._sum.totalAmount ?? 0}
        totalAmountThisMonth={month._sum.totalAmount ?? 0}
        totalOrders={totalOrders}
      />
    </PageWrapper>
  );
}
