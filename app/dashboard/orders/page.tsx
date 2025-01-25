import { redirect } from "next/navigation";

import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import { prisma } from "@/db/prisma";
import { OrderStatus } from "@prisma/client";
import DisplayStatusHeader from "@/app/dashboard/orders/_components/display-status-header";
import DisplayTable from "@/app/dashboard/orders/_components/display-table";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

export type SortOrder = "asc" | "desc";

interface OrdersProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Orders({ searchParams }: OrdersProps) {
  if (Object.keys(await searchParams).length === 0) {
    return redirect("/dashboard/orders?status=confirmed");
  }

  const awaitedParams = await searchParams;
  const status = awaitedParams.status || "CONFIRMED";

  if (
    !Object.values(OrderStatus).some(
      (x) => x === status.toString().toUpperCase()
    )
  ) {
    return redirect("/dashboard/orders?status=confirmed");
  }

  const pageSize = Number(awaitedParams.pageSize) || 5;
  const currentPage = Number(awaitedParams.page) || 1;
  const orderBy = updateOrder(String(awaitedParams.sort));

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: status.toString().toUpperCase() as OrderStatus },
      orderBy: { createdAt: orderBy },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),
    prisma.order.count({
      where: { status: status.toString().toUpperCase() as OrderStatus },
    }),
  ]);

  return (
    <PageWrapper>
      <h1 className="text-2xl font-semibold my-5">Поръчки ({totalOrders})</h1>
      <DisplayStatusHeader />
      <DisplayTable orders={orders} />
      <div className="bg-white border rounded-md py-3 px-4 mt-5">
        <PaginationWithLinks
          page={currentPage}
          pageSize={pageSize}
          totalCount={totalOrders}
          pageSizeSelectOptions={{
            pageSizeOptions: [5, 10, 25, 50],
          }}
        />
      </div>
    </PageWrapper>
  );
}

function updateOrder(orderBy: string): SortOrder {
  if (orderBy === "asc" || orderBy === "desc") {
    return orderBy;
  }

  return "desc";
}
