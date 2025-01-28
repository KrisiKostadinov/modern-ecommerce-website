"use client";

import { ShoppingBag, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import deleteAction from "@/app/products/[slug]/_actions/delete-from-cart";

type AlertMessageProps = {
  productId: string;
};

export default function AlertMessage({ productId }: AlertMessageProps) {
  const [isLoading, setIsLoasding] = useState<boolean>(false);

  const onDelete = async () => {
    setIsLoasding(true);
    await deleteAction(productId);
    toast.success("Продуктът беше успешно премахнат от кошницата", {
      position: "top-center",
    });
    setIsLoasding(false);
  };

  return (
    <div className="bg-white border rounded py-3 px-4 mb-5 flex justify-between items-center">
      <div>Добавено в кошницата</div>
      <div className="space-x-5">
        <Button onClick={onDelete} disabled={isLoading}>
          <ShoppingBag />
          <span>Отиване към кошницата</span>
        </Button>
        <Button variant={"destructive"} onClick={onDelete} disabled={isLoading}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}