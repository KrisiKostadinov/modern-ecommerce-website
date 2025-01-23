"use client";

import { TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import deleteAction from "@/app/products/[slug]/_actions/delete-from-cart";

type AlertMessageProps = {
  productId: string;
}

export default function AlertMessage({ productId }: AlertMessageProps) {
  const [isLoading, setIsLoasding] = useState<boolean>(false);

  const onDelete = async () => {
    setIsLoasding(true);
    await deleteAction(productId);
    toast.success("Продуктът беше успешно премахнат от кошницата");
    setIsLoasding(false);
  }

  return (
    <div className="bg-white border rounded py-3 px-4 flex justify-between items-center">
      <div className="text-xl">Добавено в кошницата</div>
      <Button variant={"destructive"} onClick={onDelete} disabled={isLoading}>
        <TrashIcon />
        <span>{isLoading ? "Зареждане..." : "Премахване"}</span>
      </Button>
    </div>
  );
}
