"use client";

import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
import DisplaySortHeader from "./display-sort-header";

interface OrderStatusItem {
  key: OrderStatus;
  label: string;
}

const statuses: OrderStatusItem[] = [
  {
    key: "CONFIRMED",
    label: "Потвърдени",
  },
  {
    key: "DELIVERED",
    label: "Доставени",
  },
  {
    key: "SHIPPED",
    label: "Изпратени",
  },
  {
    key: "CANCELLED",
    label: "Отказани",
  },
  {
    key: "PENDING",
    label: "Чакащи",
  },
  {
    key: "PROCESSING",
    label: "В процес",
  },
  {
    key: "RETURNED",
    label: "Върнати",
  },
];

export default function DisplayStatusHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onUpdate = (status: OrderStatus) => {
    const url = `/dashboard/orders?status=${status.toLowerCase()}`;
    router.push(url);
  };

  const isActive = (status: OrderStatus) => {
    return status.toLowerCase() === searchParams.get("status");
  }

  return (
    <ScrollArea className="bg-white border rounded-md py-3 px-4 mb-5">
      <div className="flex gap-2">
        <DisplaySortHeader />
        {statuses.map((status, index) => (
          <Button
            variant={isActive(status.key) ? "default" : "outline"}
            key={index}
            onClick={() => onUpdate(status.key)}
          >
            {status.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
