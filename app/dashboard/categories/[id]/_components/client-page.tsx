"use client";

import { Trash2Icon } from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "@/app/dashboard/_components/page-header";
import deleteAction from "@/app/dashboard/categories/[id]/_actions/delete-action";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ClientPageProps = {
  heading: string;
  categoryId?: string;
};

export default function ClientPage({ heading, categoryId }: ClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteCallback = async () => {
    if (!confirm("Сигурни ли сте, че искате да изтриете тази категория? Тази операция е необратима.")) {
      return;
    }
    
    setIsLoading(true);

    const result = await deleteAction(categoryId);

    setIsLoading(false);

    if (result?.error) {
      return toast.error(result.error);
    }

    toast.success(result.message);
    router.push("/dashboard/categories");
  };

  return (
    <PageHeader
      heading={heading}
      loading={isLoading}
      button={
        categoryId
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