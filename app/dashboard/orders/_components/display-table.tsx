"use client";

import { MenuIcon } from "lucide-react";

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
import { Order } from "@prisma/client";
import { displayStatusLabel, formatPrice } from "@/lib/utils";

type DisplayTableProps = {
  orders: Order[];
};

export default function DisplayTable({ orders }: DisplayTableProps) {
  return (
    <ScrollArea className="bg-white border rounded-md py-3 px-4">
      <table className="border-collapse w-full text-left">
        <thead>
          <tr>
            <th className="min-w-[200px] border py-1 px-2">&#8470;</th>
            <th className="min-w-[200px] border py-1 px-2">Адрес</th>
            <th className="min-w-[200px] border py-1 px-2">Град</th>
            <th className="min-w-[200px] border py-1 px-2">Имейл</th>
            <th className="min-w-[200px] border py-1 px-2">Име и фамилия</th>
            <th className="min-w-[200px] border py-1 px-2">Статус</th>
            <th className="min-w-[200px] border py-1 px-2">Телефон</th>
            <th className="min-w-[200px] border py-1 px-2">Сума</th>
            <th className="min-w-[200px] border py-1 px-2 text-center">
              Опции
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
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
              <td className="relative border py-1 px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                    <MenuIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Статус</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Доставена</DropdownMenuItem>
                        <DropdownMenuItem>Изпратена</DropdownMenuItem>
                        <DropdownMenuItem>Изчакване</DropdownMenuItem>
                        <DropdownMenuItem>Отказана</DropdownMenuItem>
                        <DropdownMenuItem>Изпълнява се</DropdownMenuItem>
                        <DropdownMenuItem>Върната</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem>Изтриване</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}