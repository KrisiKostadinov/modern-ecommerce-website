import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import ClientPage from "@/app/dashboard/orders/[slug]/_components/client-page";
import { OrderProduct } from "@/app/order/_actions/create-order";
import { Product } from "@prisma/client";

export type OrderProductWithProduct = {
    product: Product;
    orderProduct: OrderProduct;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const order = await prisma.order.findUnique({
    where: { id: slug },
  });

  if (!order) {
    return redirect("/dashboard/orders?status=confirmed");
  }

  const orderProducts = order.orderProducts as OrderProduct[];
  const productIds = orderProducts.map((x) => x.id);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const orderProductsWithProducts: OrderProductWithProduct[] = orderProducts
    .map((orderProduct) => {
      const product = products.find((x) => x.id === orderProduct.id);

      return {
        product,
        orderProduct,
      };
    })
    .filter(
      (item): item is { product: Product; orderProduct: OrderProduct } =>
        item.product !== undefined
    );

  return (
    <div className="container mx-auto">
      <ClientPage order={order} orderProductsWithProducts={orderProductsWithProducts} />
    </div>
  );
}
