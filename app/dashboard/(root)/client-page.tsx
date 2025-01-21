"use client";

import { FolderKanban, LayoutList } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import PageHeader from "@/app/dashboard/_components/page-header";

type ClientPageProps = {
  categoriesCount: number;
  productsCount: number;
};

export default function ClientPage({ categoriesCount, productsCount }: ClientPageProps) {
  return (
    <>
      <PageHeader heading="Табло" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <DisplayItemBox
          title="Категории"
          link="/dashboard/categories"
          number={categoriesCount}
          icon={<LayoutList size={48} />}
        />
        <DisplayItemBox
          title="Продукти"
          link="/dashboard/products"
          number={productsCount}
          icon={<FolderKanban size={48} />}
        />
      </div>
    </>
  );
}

type DisplayItemBoxProps = {
  title: string;
  link: string;
  number: number;
  icon: ReactNode;
};

const DisplayItemBox = ({ title, link, number, icon: Icon }: DisplayItemBoxProps) => {
  return (
    <Link href={link}>
      <div className="bg-white h-32 border rounded shadow flex items-center justify-between p-5">
        <div>
          <span className="text-2xl font-semibold">{title}</span>
          <h2 className="text-4xl">{number}</h2>
        </div>
        {Icon}
      </div>
    </Link>
  );
};
