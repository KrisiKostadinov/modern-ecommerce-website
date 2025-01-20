import { Metadata } from "next";
import { ImageIcon, LayoutList } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/db/prisma";
import { Product } from "@prisma/client";
import CustomAlert from "@/app/dashboard/_components/custom-alert";
import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/products/_components/client-page";

export const metadata: Metadata = {
  title: "Продукти"
}

export default async function Products() {
  const products = await prisma.product.findMany();

  return (
    <PageWrapper>
      <ClientPage productsLength={products.length} />
      {products.length === 0 && (
        <CustomAlert
          title="Продукти"
          description="Няма намерени продукти"
          icon={<LayoutList />}
        />
      )}
      <div className="flex flex-col gap-2">
        {products.map((product, index) => (
          <SingleProduct key={index} product={product} />
        ))}
      </div>
    </PageWrapper>
  );
}

const SingleProduct = ({ product }: { product: Product }) => {
  return (
    <Link href={`/dashboard/products/${product.id}`}>
      <div className="bg-white border rounded shadow py-2 px-4">
        <div className="flex items-center gap-5">
          {product.thumbnailImage ? (
            <Image
              className="w-20 h-20 object-cover border rounded"
              src={product.thumbnailImage}
              alt="Product Image"
              width={300}
              height={300}
              priority
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          )}
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-muted-foreground line-clamp-2">{product.description || "Няма описание"}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
