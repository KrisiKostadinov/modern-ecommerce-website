import { ImageIcon, LayoutList } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/db/prisma";
import { Category } from "@prisma/client";

import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/categories/_components/client-page";
import CustomAlert from "@/app/dashboard/_components/custom-alert";

export default async function Categories() {
  const categories = await prisma.category.findMany();

  return (
    <PageWrapper>
      <ClientPage categoriesLength={categories.length} />
      {categories.length === 0 && (
        <CustomAlert
          title="Категории"
          description="Няма намерени категории"
          icon={<LayoutList />}
        />
      )}
      <div className="flex flex-col gap-2">
        {categories.map((category, index) => (
          <SingleCategory key={index} category={category} />
        ))}
      </div>
    </PageWrapper>
  );
}

const SingleCategory = ({ category }: { category: Category }) => {
  return (
    <Link href={`/dashboard/categories/${category.id}`}>
      <div className="bg-white border rounded shadow py-2 px-4">
        <div className="flex items-center gap-5">
          {category.imageUrl ? (
            <Image
              className="w-20 h-20 object-cover border rounded"
              src={category.imageUrl}
              alt="Category Image"
              width={300}
              height={300}
              priority
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          )}
          <div>
            <div className="font-semibold">{category.name}</div>
            <div className="text-muted-foreground line-clamp-2">{category.description || "Няма описание"}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
