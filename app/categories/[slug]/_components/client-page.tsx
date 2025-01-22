"use client";

import { Category, Product } from "@prisma/client";
import { DisplayCategoryBox } from "@/app/categories/[slug]/_components/display-category-box";
import { DisplayProductsWrapper } from "@/app/categories/[slug]/_components/display-products-wrapper";

type ClientPageProps = {
  category: Category;
  products: Product[];
};

export default function ClientPage({ category, products }: ClientPageProps) {
  return (
    <div className="space-y-5">
      <DisplayCategoryBox category={category} />
      <DisplayProductsWrapper products={products} />
    </div>
  );
}
