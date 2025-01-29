"use client";

import { ShoppingBag, TrashIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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
    setIsLoasding(false);
  };

  return (
    <div className="bg-white border rounded py-3 px-4 mb-5 flex justify-between items-center">
      <div>Добавено в кошницата</div>
      <div className="space-x-5 flex">
        <Link href={"/cart"} onClick={() => setIsLoasding(true)}>
          <Button className="hidden xl:flex" disabled={isLoading}>
            <ShoppingBag />
            <span>{isLoading ? "Зареждане..." : "Отиване към кошницата"}</span>
          </Button>
        </Link>
        <Button variant={"destructive"} onClick={onDelete} disabled={isLoading}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
