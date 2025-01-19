"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/dashboard/_components/page-header";

type ClientPageProps = {
  categoriesLength: number;
}

export default function ClientPage({ categoriesLength }: ClientPageProps) {
  
  const router = useRouter();

  const callback = () => {
    router.push(`/dashboard/categories/create`);
  }

  return (
    <>
      <PageHeader
        heading={`Категории (${categoriesLength})`}
        button={{ text: "Добавяне", icon: <PlusIcon />, callback }}
      />
    </>
  );
}
