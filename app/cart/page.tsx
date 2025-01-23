import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/session";
import { Product } from "@prisma/client";
import ClientPage from "@/app/cart/_components/client-page";
import { CartItem } from "@/app/products/[slug]/_actions/add-to-cart-action";
import { Metadata } from "next";

export type CartItemWithProduct = {
  cartItem: CartItem;
  product: Product;
};

export const metadata: Metadata = {
  title: "Кошница - Подари усмивка",
}

export default async function Cart() {
  const cartItems = await getSession("cart");

  const productIds = cartItems.map((x) => x.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const cartItemsWithProducts: CartItemWithProduct[] = cartItems
    .map((cartItem) => {
      const product = products.find((x) => x.id === cartItem.productId);

      return {
        product,
        cartItem,
      };
    })
    .filter((item): item is CartItemWithProduct => item.product !== undefined);

  return (
    <div className="container mx-auto pb-5">
      <h1 className="my-5 text-2xl text-center font-semibold">Кошница</h1>
      <ClientPage cartItemWithProducts={cartItemsWithProducts} />
    </div>
  );
}