"use client";

import {
  ChevronDown,
  ChevronUp,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
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

type ClientPageProps = {
  product: Product;
  cart: CartItem[];
  productCategories: Category[];
};

export default function ClientPage({
  product,
  cart,
  productCategories,
}: ClientPageProps) {
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(
    product.thumbnailImage
  );

  const increase = () => {
    if (quantity >= product.quantity) {
      return toast.error(`Максимално количество е ${product.quantity}`);
    }

    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity <= 1) {
      return toast.error("Минимално количество е 1");
    }

    setQuantity(quantity - 1);
  };

  const addToCart = async () => {
    setIsLoading(true);

    const result = await addToCartAction(product.id, quantity);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }

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
        <div className="space-y-5 h-[600px] overflow-y-auto">
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
            <div className="bg-white border rounded shadow py-3 px-4 space-y-5">
              <div className="flex items-center justify-between gap-5">
                <div className="space-y-1">
                  <Label>Количество</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={"outline"}
                      onClick={increase}
                      disabled={
                        cart.find((x) => x.productId === product.id) !==
                        undefined
                      }
                    >
                      <PlusIcon />
                    </Button>
                    <Input
                      className="w-20"
                      type="number"
                      defaultValue={quantity}
                      min={1}
                      max={product.quantity}
                    />
                    <Button
                      variant={"outline"}
                      onClick={decrease}
                      disabled={
                        cart.find((x) => x.productId === product.id) !==
                        undefined
                      }
                    >
                      <MinusIcon />
                    </Button>
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
              <Button
                size={"lg"}
                className="w-full"
                onClick={addToCart}
                disabled={isLoading}
              >
                <ShoppingBagIcon className="mr-2" />
                {isLoading
                  ? "Добавяне..."
                  : cart.find((x) => x.productId === product.id)
                  ? "Обнови количеството"
                  : "Добави в кошницата"}
              </Button>
            </div>
          )}
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
            {productCategories.length === 0 && (
              <div className="text-slate-700">Няма</div>
            )}
          </div>
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
