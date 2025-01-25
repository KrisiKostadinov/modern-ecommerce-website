"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/order/_components/client-page";
import { saveSession } from "@/lib/session";
import { UserDeliveryData } from "@/app/order/_actions/helper";
import { generateOrderCode } from "@/lib/utils";
import {
  calculateTotalAmount,
  getCartItems,
  getCartItemsWithProducts,
} from "@/app/cart/_actions/helper";
import removeCart from "@/app/cart/_actions/remove-cart";

export type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export async function createOrderAction(values: FormSchemaProps) {
  if (values.isSaveData) {
    const data: UserDeliveryData = {
      fullname: values.fullname,
      email: values.email,
      deliveryCity: values.deliveryCity,
      deliveryAddress: values.deliveryAddress,
      phoneNumber: values.phoneNumber,
    };

    await saveSession("user_delivery_data", JSON.stringify(data));
  }

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

  const orderNumber = generateOrderCode();
  const totalAmount = calculateTotalAmount(cartItemsWithProducts);

  const orderProducts: OrderProduct[] = [];

  cartItemsWithProducts.forEach((cartItem) => {
    if (cartItem.product.originalPrice) {
      const price = cartItem.product.sellingPrice ? cartItem.product.sellingPrice : cartItem.product.originalPrice;

      orderProducts.push({
        id: cartItem.product.id,
        name: cartItem.product.name,
        price,
        quantity: cartItem.cartItem.quantity,
      });
    }
  });

  const createdOrder = await prisma.order.create({
    data: {
      orderNumber,
      totalAmount,
      fullname: values.fullname,
      deliveryAddress: values.deliveryAddress,
      deliveryCity: values.deliveryCity,
      email: values.email,
      phoneNumber: values.phoneNumber,
      status: "CONFIRMED",
      paymentMethod: values.paymentMethod,
      deliveryMethod: values.deliveryMethod,
      paymentStatus: "PENDING",
      orderProducts,
    },
  });

  if (!createdOrder) {
    return { error: "Нещо се обърка" };
  }

  await removeCart();

  redirect(`/success-order/${orderNumber}`);
}
