"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/order/_components/client-page";
import { saveSession } from "@/lib/session";
import { UserDeliveryData } from "@/app/order/_actions/helper";
import { formatPrice, generateOrderCode } from "@/lib/utils";
import {
  calculateTotalAmount,
  getCartItems,
  getCartItemsWithProducts,
} from "@/app/cart/_actions/helper";
import removeCart from "@/app/cart/_actions/remove-cart";
import { replaceVariables } from "@/lib/mails/helper";
import { sendEmail } from "@/lib/mails/send-email";

export type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export async function createOrderAction(values: FormSchemaProps) {
  try {
    const result = await prisma.$transaction(async (tx) => {
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

      const products = await tx.product.findMany({
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
          const price = cartItem.product.sellingPrice
            ? cartItem.product.sellingPrice
            : cartItem.product.originalPrice;

          orderProducts.push({
            id: cartItem.product.id,
            name: cartItem.product.name,
            price,
            quantity: cartItem.cartItem.quantity,
          });
        }
      });

      const createdOrder = await tx.order.create({
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
        return { error: "Грешка при създаването на поръчката." }
      }

      const table = generateTable(orderProducts);

      const emailTemplate = await tx.emailTemplate.findFirst({
        where: { key: "confirm-client-order" },
      });

      if (!emailTemplate || !emailTemplate.code) {
        return { error: "Имейл темплейтът не е намерен." }
      }

      const emailValues = {
        website_name: process.env.WEBSITE_TITLE || "",
        website_url: process.env.NEXT_PUBLIC_SITE_URL || "",
        current_year: new Date().getFullYear().toString() || "",
        email: values.email || "",
        customer_name: values.fullname,
        table: table,
        total_amount: formatPrice(totalAmount),
        website_email: process.env.NEXT_PUBLIC_SITE_URL || "",
        support_email: process.env.ADMIN_SUPPORT_EMAIL || "",
        support_phone: process.env.ADMIN_SUPPORT_PHONE || "",
      };

      const replacedHtml = replaceVariables(emailTemplate.code, emailValues);

      if (!replacedHtml.success) {
        throw new Error(replacedHtml.result);
      }

      const emailResult = await sendEmail({
        to: values.email,
        subject: "Потвърждение на поръчка",
        html: replacedHtml.result,
        allowReply: false,
      });

      if (emailResult.error) {
        throw new Error(emailResult.error);
      }

      await removeCart();

      return { success: true, orderNumber };
    });

    return result;
  } catch (error) {
    console.error("Error in createOrderAction:", error);
    return { error: (error as Error).message || "Неизвестна грешка." };
  }
}

const generateTable = (orderProducts: OrderProduct[]): string => {
  const tableHeader = `
    <thead>
      <tr>
        <th>Пр.</th>
        <th>Бр.</th>
        <th>Цена</th>
        <th>Общо</th>
      </tr>
    </thead>
  `;

  const tableRows = orderProducts
    .map(
      (product) => `
        <tr>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>${formatPrice(product.price)}</td>
          <td>${formatPrice(product.price * product.quantity)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <table class="product-table">
      ${tableHeader}
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};
