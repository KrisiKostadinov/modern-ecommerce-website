"use client";

import { MenuIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Order, OrderStatus } from "@prisma/client";
import { displayStatusLabel, formatPrice } from "@/lib/utils";
import updateStatus from "@/app/dashboard/orders/_actions/update-status";

type DisplayTableProps = {
  orders: Order[];
};

export default function DisplayTable({ orders }: DisplayTableProps) {
  const router = useRouter();

  const onUpdateStatus = async (id: string, status: OrderStatus) => {
    const result = await updateStatus(id, status);

    if (result.error) {
      return toast.error(result.error);
    }

    router.refresh();
    toast.success(result.message);
  };

  return (
    <ScrollArea className="bg-white border rounded-md py-3 px-4">
      <table className="border-collapse w-full text-left">
        <thead>
          <tr>
            <th className="min-w-[40px] border py-1 px-2 text-center">
              Опции
            </th>
            <th className="min-w-[200px] border py-1 px-2">&#8470;</th>
            <th className="min-w-[200px] border py-1 px-2">Адрес</th>
            <th className="min-w-[200px] border py-1 px-2">Град</th>
            <th className="min-w-[200px] border py-1 px-2">Имейл</th>
            <th className="min-w-[200px] border py-1 px-2">Име и фамилия</th>
            <th className="min-w-[200px] border py-1 px-2">Статус</th>
            <th className="min-w-[200px] border py-1 px-2">Телефон</th>
            <th className="min-w-[200px] border py-1 px-2">Сума</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order, index) => (
              <tr key={index}>
                <td className="relative border py-1 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                      <MenuIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Статус</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(order.id, "CONFIRMED")
                            }
                          >
                            Потвърдена
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(order.id, "DELIVERED")
                            }
                          >
                            Доставена
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(order.id, "SHIPPED")}
                          >
                            Изпратена
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(order.id, "CANCELLED")
                            }
                          >
                            Отказана
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(order.id, "PENDING")}
                          >
                            Изчакване
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(order.id, "PROCESSING")
                            }
                          >
                            Изпълнява се
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(order.id, "RETURNED")}
                          >
                            Върната
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/orders/${order.id}`)
                        }
                      >
                        Показване на продуктите
                      </DropdownMenuItem>
                      <DropdownMenuItem>Изтриване</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="border py-1 px-2">{order.orderNumber}</td>
                <td className="border py-1 px-2">{order.deliveryCity}</td>
                <td className="border py-1 px-2">{order.deliveryAddress}</td>
                <td className="border py-1 px-2">{order.email}</td>
                <td className="border py-1 px-2">{order.fullname}</td>
                <td className="border py-1 px-2">
                  {displayStatusLabel(order.status)}
                </td>
                <td className="border py-1 px-2">{order.phoneNumber}</td>
                <td className="border py-1 px-2">
                  {formatPrice(order.totalAmount)}
                </td>
              </tr>
            ))}
          {orders.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="border py-1 px-2 text-muted-foreground"
              >
                Няма намерени поръчки
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
