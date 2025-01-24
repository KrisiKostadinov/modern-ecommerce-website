"server-only";

import { getSession } from "@/lib/session";
import { CartItem } from "@/app/products/[slug]/_actions/add-to-cart-action";
import { CartItemWithProduct } from "@/app/cart/page";
import { Product } from "@prisma/client";

export const getCartItems = async (): Promise<CartItem[]> => {
  const decrypted = await getSession("cart");

  if (decrypted && decrypted.payload && typeof decrypted.payload === "object") {
    const parsedData = JSON.parse((decrypted.payload as { data: string }).data);
    return parsedData;
  }

  return [];
};

export const calculateTotalAmount = (
  cartItemWithProducts: CartItemWithProduct[]
) => {
  return cartItemWithProducts.reduce((acc, cartItem) => {
    const price =
      cartItem.product.sellingPrice || cartItem.product.originalPrice;
    if (price) {
      acc += cartItem.cartItem.quantity * price;
    }
    return acc;
  }, 0);
};

export const getCartItemsWithProducts = (
  cartItems: CartItem[],
  products: Product[]
) =>
  cartItems
    .map((cartItem) => {
      const product = products.find((x) => x.id === cartItem.productId);

      return {
        product,
        cartItem,
      };
    })
    .filter((item): item is CartItemWithProduct => item.product !== undefined);
