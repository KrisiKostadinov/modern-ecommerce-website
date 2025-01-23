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
import { updateOriginalPrice } from "@/app/dashboard/products/[slug]/_actions/update-price";

type UpdateOriginalPrice = {
  productId: string;
  originalPrice: number | null;
};

const formSchema = z.object({
  originalPrice: z.coerce.number().nullable(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateOriginalPrice({
  productId,
  originalPrice,
}: UpdateOriginalPrice) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalPrice: originalPrice || null,
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    if (!productId) {
      return toast.error("Този продукт не е намерен");
    }

    const result = await updateOriginalPrice(productId, values.originalPrice);

    if (result.error) {
      return toast.error(result.error);
    }

    setIsOpen(false);
    toast.success(result.message);
    router.refresh();
  };

  const displayOriginalPrice = originalPrice ? formatPrice(originalPrice) : "Няма";
  const displayButtonText = !productId ? "Добавяне" : "Промяна";
  const displayFormButtonText = !productId ? "Добавяне" : form.formState.isSubmitting ? "Зареждане..." : "Запазване";

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4 h-fit">
      <div>
        <div className="font-semibold">Оригинална цена</div>
        <div className="text-muted-foreground">{displayOriginalPrice}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Оригинална цена на продукта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Напишете оригинална цена на продукта"
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