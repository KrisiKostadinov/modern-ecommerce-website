"use client";

import Image from "next/image";
import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@prisma/client";

type DisplayProductsWrapperProps = {
  products: Product[];
};

export const DisplayProductsWrapper = ({ products }: DisplayProductsWrapperProps) => {
  return (
    <div className="container mx-auto max-sm:px-5 pb-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            key={product.id}
            className="bg-white shadow-md rounded-md p-4 space-y-2"
          >
            {product.thumbnailImage && (
              <Image
                src={product.thumbnailImage}
                alt={product.name}
                width={600}
                height={600}
                priority
                className="w-full h-[300px] object-cover border rounded-md"
              />
            )}
            <h2 className="text-lg font-semibold">{product.name}</h2>
            {product.originalPrice && (
              <div className="flex gap-5">
                <p className={cn("", product.sellingPrice && "line-through")}>
                  {formatPrice(product.originalPrice)}
                </p>
                {product.sellingPrice && (
                  <p className="text-destructive">
                    {formatPrice(product.sellingPrice)}
                  </p>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
