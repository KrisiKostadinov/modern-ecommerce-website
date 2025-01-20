"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/dashboard/_components/page-header";

type ClientPageProps = {
  productsLength: number;
}

export default function ClientPage({ productsLength }: ClientPageProps) {
  
  const router = useRouter();

  const callback = () => {
    router.push(`/dashboard/products/create`);
  }

  return (
    <>
      <PageHeader
        heading={`Продукти (${productsLength})`}
        button={{ text: "Добавяне", icon: <PlusIcon />, callback }}
      />
    </>
  );
}
