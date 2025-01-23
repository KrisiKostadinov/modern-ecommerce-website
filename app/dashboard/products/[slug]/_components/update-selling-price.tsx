"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PenIcon, SaveIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { updateSellingPrice } from "@/app/dashboard/products/[slug]/_actions/update-price";

type UpdateOriginalPrice = {
  productId: string;
  sellingPrice: number | null;
};

const formSchema = z.object({
  sellingPrice: z.coerce.number().nullable(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateOriginalPrice({
  productId,
  sellingPrice,
}: UpdateOriginalPrice) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellingPrice: sellingPrice || null,
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    if (!productId) {
      return toast.error("Този продукт не е намерен");
    }

    const result = await updateSellingPrice(productId, values.sellingPrice);

    if (result.error) {
      return toast.error(result.error);
    }

    setIsOpen(false);
    toast.success(result.message);
    router.refresh();
  };

  const displayOriginalPrice = sellingPrice ? formatPrice(sellingPrice) : "Няма";
  const displayButtonText = !productId ? "Добавяне" : "Промяна";
  const displayFormButtonText = !productId ? "Добавяне" : form.formState.isSubmitting ? "Зареждане..." : "Запазване";

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4 h-fit">
      <div>
        <div className="font-semibold">Промоционална цена</div>
        <div className="text-muted-foreground">{displayOriginalPrice}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена на промоция на продукта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Напишете промоционална цена на продукта"
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <SaveIcon />
                {displayFormButtonText}
              </Button>
              <Button
                variant={"outline"}
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Отказ
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button onClick={() => setIsOpen(true)}>
          <PenIcon />
          {displayButtonText}
        </Button>
      )}
    </div>
  );
}