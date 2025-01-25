"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SortOrder } from "@/app/dashboard/orders/page";

export default function DisplaySortHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onUpdate = (sort: SortOrder) => {
    const status = searchParams.get("status") as OrderStatus;
    const url = `/dashboard/orders?status=${status.toLowerCase()}&sort=${sort}`;
    router.push(url);
    setIsOpen(false);
  };

  const isActive = (sort: SortOrder) => {
    return sort.toLowerCase() === searchParams.get("sort");
  };

  const sortedByLabel = () => {
    const label = searchParams.get("sort") === "asc" ? "Най-стари" : "Най-нови";
    return label;
  };

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>{sortedByLabel()}</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full flex flex-col">
          <div>Сортиране по:</div>
          <Button
            className="w-[300px] justify-start mt-1"
            variant={isActive("desc") ? "default" : "outline"}
            onClick={() => onUpdate("desc")}
          >
            Най-нови
          </Button>
          <Button
            className="w-[300px] justify-start mt-1"
            variant={isActive("asc") ? "default" : "outline"}
            onClick={() => onUpdate("asc")}
          >
            Най-стари
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}