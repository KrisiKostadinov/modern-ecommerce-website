"use client";

import {
  ChevronDown,
  ChevronUp,
  ShoppingBagIcon,
  ShoppingBasket,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { Category, Product } from "@prisma/client";
import {
  addToCartAction,
  CartItem,
} from "@/app/products/[slug]/_actions/add-to-cart-action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlertMessage from "./alert-message";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ClientPageProps = {
  product: Product;
  cartItems: CartItem[];
  productCategories: Category[];
};

export default function ClientPage({
  product,
  cartItems,
  productCategories,
}: ClientPageProps) {
  const router = useRouter();

  const cartItem = cartItems.find((x) => x.productId === product.id);
  const isInCart = Boolean(cartItem);

  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentQuantity =
    cartItem && Number(cartItem.quantity) ? cartItem.quantity : 1;

  const [quantity, setQuantity] = useState<number>(currentQuantity);
  const [previewImage, setPreviewImage] = useState<string | null>(
    product.thumbnailImage
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const addToCart = async () => {
    setIsLoading(true);

    const result = await addToCartAction(product.id, quantity);

    if (result.error) {
      toast.error(result.error);
    }

    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="space-y-5 mt-5 max-sm:px-5">
      <div className="grid md:grid-cols-2 gap-5">
        {previewImage && (
          <div className="bg-white relative w-full h-[300px] md:h-[600px] shadow rounded-md overflow-hidden p-2">
            <Image
              src={previewImage}
              alt={product.name}
              width={800}
              height={600}
              priority
              className="w-full h-full object-cover border rounded-md"
            />
          </div>
        )}
        <div>
          <ScrollArea className="flex flex-col max-h-[600px]">
            {isInCart && <AlertMessage productId={product.id} />}
            <div className="bg-white border rounded shadow py-3 px-4">
              <h1 className="text-3xl font-bold mb-5">{product.name}</h1>
              <p className={!isShowDescription ? "line-clamp-4" : ""}>
                {product.description}
              </p>
              <Button
                variant={"outline"}
                onClick={() => setIsShowDescription(!isShowDescription)}
                className="mt-5"
              >
                {!isShowDescription ? <ChevronDown /> : <ChevronUp />}
                {isShowDescription ? "По-малко" : "Повече"}
              </Button>
            </div>
            {product.originalPrice && (
              <div className="bg-white border rounded shadow py-3 px-4 space-y-5 mt-5">
                <div className="flex items-center justify-between gap-5">
                  <div className="space-y-1">
                    <Label>Количество</Label>
                    <div className="flex gap-2">
                      <Input
                        className="w-20"
                        type="number"
                        defaultValue={quantity}
                        min={1}
                        max={product.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p
                      className={cn(
                        "text-xl",
                        product.sellingPrice && "line-through"
                      )}
                    >
                      {formatPrice(product.originalPrice)}
                    </p>
                    {product.sellingPrice && (
                      <p className="text-destructive text-xl">
                        {formatPrice(product.sellingPrice)}
                      </p>
                    )}
                  </div>
                </div>
                {isInCart && (
                  <Link
                    href={"/cart"}
                    className="block"
                    onClick={() => setIsLoading(true)}
                  >
                    <Button variant={"outline"} className="w-full">
                      <ShoppingBasket />
                      {isLoading ? "Зареждане..." : "Отиване към кошницата"}
                    </Button>
                  </Link>
                )}
                <Button
                  size={"lg"}
                  className="w-full"
                  onClick={addToCart}
                  disabled={isLoading}
                >
                  <ShoppingBagIcon className="mr-2" />
                  {isLoading
                    ? "Добавяне..."
                    : isInCart
                    ? "Обнови количеството"
                    : "Добави в кошницата"}
                </Button>
              </div>
            )}
            {productCategories.length > 0 && (
              <div className="bg-white border rounded shadow py-3 px-4 mt-5">
                <div className="text-xl font-semibold mb-2">Категории</div>
                <div className="flex flex-col gap-2">
                  {productCategories.map((category, index) => (
                    <Link
                      href={`/categories/${category.slug}`}
                      key={index}
                      className="text-slate-700 hover:text-primary hover:bg-primary/10 py-1 px-2 border rounded"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div className="pb-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {product.images.map((image, index) => (
          <div
            key={index}
            className="bg-white relative h-[300px] shadow-lg rounded-md overflow-hidden p-2"
          >
            <Image
              src={image}
              alt={product.name}
              width={400}
              height={300}
              priority
              className="w-full h-full object-cover border rounded-md cursor-pointer"
              onClick={() => setPreviewImage(image)}
              title="Натисни за да видиш по-голям размер"
            />
          </div>
        ))}
      </div>
    </div>
  );
}