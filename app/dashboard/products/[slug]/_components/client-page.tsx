"use client";

import { Trash2Icon } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/app/dashboard/_components/page-header";
import deleteAction from "@/app/dashboard/products/[slug]/_actions/delete-action";

type ClientPageProps = {
  heading: string;
  prodcutId?: string;
};

export default function ClientPage({ heading, prodcutId }: ClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteCallback = async () => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този продукт? Тази операция е необратима.")) {
      return;
    }
    
    setIsLoading(true);

    const result = await deleteAction(prodcutId);

    setIsLoading(false);

    if (result?.error) {
      return toast.error(result.error);
    }

    toast.success(result.message);
    router.push("/dashboard/products");
  };

  return (
    <PageHeader
      heading={heading}
      loading={isLoading}
      button={
        prodcutId
          ? {
              text: "Изтриване",
              icon: <Trash2Icon />,
              callback: deleteCallback,
            }
          : null
      }
    />
  );
}