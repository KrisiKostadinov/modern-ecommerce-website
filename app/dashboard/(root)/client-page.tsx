"use client";

import { LayoutList } from "lucide-react";
import Link from "next/link";

import PageHeader from "@/app/dashboard/_components/page-header";

type ClientPageProps = {
  categoriesCount: number;
};

export default function ClientPage({ categoriesCount }: ClientPageProps) {
  return (
    <>
      <PageHeader heading="Табло" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <Link href={"/dashboard/categories"}>
          <div className="bg-white h-32 border rounded shadow flex items-center justify-between p-5">
            <div>
              <span className="text-2xl font-semibold">Категории</span>
              <h2 className="text-4xl">{categoriesCount}</h2>
            </div>
            <LayoutList className="w-10 h-10" />
          </div>
        </Link>
      </div>
    </>
  );
}
