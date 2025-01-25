import { Metadata } from "next";

import { prisma } from "@/db/prisma";
import { Product } from "@prisma/client";
import ClientPage from "@/app/cart/_components/client-page";
import {
  calculateTotalAmount,
  getCartItems,
  getCartItemsWithProducts,
} from "@/app/cart/_actions/helper";
import { CartItem } from "@/app/products/[slug]/_actions/add-to-cart-action";

export type CartItemWithProduct = {
  cartItem: CartItem;
  product: Product;
};

export const metadata: Metadata = {
  title: "Кошница - Подари усмивка",
};

export default async function Cart() {
  const cartItems = await getCartItems();

  const productIds = cartItems.map((x) => x.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const cartItemsWithProducts = getCartItemsWithProducts(cartItems, products);
  const totalAmount = calculateTotalAmount(cartItemsWithProducts);

  return (
    <main className="min-h-screen container mx-auto pb-5">
      <h1 className="my-5 text-2xl text-center font-semibold">Кошница</h1>
      <ClientPage
        cartItemWithProducts={cartItemsWithProducts}
        totalAmount={totalAmount}
      />
    </main>
  );
}