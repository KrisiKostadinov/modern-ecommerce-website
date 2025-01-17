"use client";

import { PlusIcon } from "lucide-react";

import PageHeader from "@/app/dashboard/_components/page-header";
import { useRouter } from "next/navigation";

export default function ClientPage() {
  const router = useRouter();

  const callback = () => {
    router.push(`/dashboard/categories/create`);
  }

  return (
    <>
      <PageHeader
        heading={"Категории"}
        button={{ text: "Добавяне", icon: <PlusIcon />, callback }}
      />
    </>
  );
}
