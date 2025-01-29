"use client";

import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";
import { CartItemWithProduct } from "@/app/cart/page";
import { Button } from "@/components/ui/button";
import updateQuantity from "@/app/cart/_actions/update-quantity";
import removeProduct from "@/app/cart/_actions/remove-product-action";
import { Card, CardHeader } from "@/components/ui/card";

type ClientPageProps = {
  cartItemWithProducts: CartItemWithProduct[];
  totalAmount: number;
};

export default function ClientPage({
  cartItemWithProducts,
  totalAmount,
}: ClientPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const increase = async (productId: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const cartItemWithProduct = cartItemWithProducts.find(
      (x) => x.product.id === productId
    );

    if (cartItemWithProduct) {
      if (
        cartItemWithProduct.cartItem.quantity + 1 >
        cartItemWithProduct.product.quantity
      ) {
        toast.error(
          `Не можете да добавите повече от ${
            cartItemWithProduct.product.quantity
          } ${cartItemWithProduct.product.quantity === 1 ? "бройка" : "бройки"}`
        );
        return;
      }

      cartItemWithProduct.cartItem.quantity++;

      const id = setTimeout(async () => {
        setIsLoading(true);
        await updateQuantity(productId, cartItemWithProduct.cartItem.quantity);
        toast.success("Количеството беше запазено", {
          position: "top-center",
        });
        setIsLoading(false);
      }, 1000);
      setTimeoutId(id);
    }
  };

  const decrease = async (productId: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const cartItemWithProduct = cartItemWithProducts.find(
      (x) => x.product.id === productId
    );

    if (cartItemWithProduct) {
      if (cartItemWithProduct.cartItem.quantity - 1 < 1) {
        const result = await removeProduct(productId);

        if (!result.success) {
          return toast.error(result.error);
        }

        return toast.success(result.success);
      }

      cartItemWithProduct.cartItem.quantity--;

      const id = setTimeout(async () => {
        setIsLoading(true);
        await updateQuantity(productId, cartItemWithProduct.cartItem.quantity);
        toast.success("Количеството беше запазено", {
          position: "top-center",
        });
        setIsLoading(false);
      }, 1000);
      setTimeoutId(id);
    }
  };

  return (
    <>
      {cartItemWithProducts.length ? (
        <div className="flex flex-col gap-2">
          {cartItemWithProducts.map((item, index) => (
            <div className="bg-white border rounded-md py-3 px-4" key={index}>
              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center gap-5">
                  {item.product.thumbnailImage && (
                    <div className="max-sm:hidden border rounded-md w-[120px] h-[120px]">
                      <Image
                        src={item.product.thumbnailImage}
                        alt={item.product.name}
                        width={240}
                        height={240}
                        priority
                        title={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    {item.product.originalPrice && (
                      <>
                        <div className="text-lg">{item.product.name}</div>
                        <div className="flex items-center gap-5">
                          {item.product.sellingPrice && (
                            <div className="text-destructive">
                              {formatPrice(item.product.sellingPrice)}
                            </div>
                          )}
                          <div
                            className={
                              cn("", item.product.sellingPrice) &&
                              "line-through"
                            }
                          >
                            {formatPrice(item.product.originalPrice)}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="mt-2">
                      <Link href={`/products/${item.product.slug}`}>
                        <Button variant={"outline"}>
                          Отиване към продукта
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  {item.product.originalPrice && (
                    <div className="flex items-center justify-end">
                      {formatPrice(
                        item.product.sellingPrice
                          ? item.product.sellingPrice
                          : item.product.originalPrice * item.cartItem.quantity
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-5">
                    <Button
                      variant={"outline"}
                      onClick={() => increase(item.product.id)}
                      disabled={
                        isLoading ||
                        item.cartItem.quantity >= item.product.quantity
                      }
                    >
                      <PlusIcon />
                    </Button>
                    {item.cartItem.quantity}
                    <Button
                      variant={"outline"}
                      onClick={() => decrease(item.product.id)}
                      disabled={isLoading || item.cartItem.quantity < 1}
                    >
                      <MinusIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Card className="w-full">
            <CardHeader className="flex justify-between items-center w-full">
              <p className="text-xl">{formatPrice(totalAmount)}</p>
              <Link
                href={"/order"}
                className="w-full"
                onClick={() => setIsLoading(true)}
              >
                <Button size={"lg"} className="w-full" disabled={isLoading}>
                  {isLoading ? "Зареждане..." : "Продължаване с поръчката"}
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="bg-white border p-10 text-gray-400 flex justify-center flex-col items-center gap-5">
          <ShoppingCart className="w-20 h-20" />
          <span>Нямате продукти в кошницата</span>
          <Link href={"/categories"}>
            <Button size={"lg"}>Продължаване на пазаруването</Button>
          </Link>
        </div>
      )}
    </>
  );
}
