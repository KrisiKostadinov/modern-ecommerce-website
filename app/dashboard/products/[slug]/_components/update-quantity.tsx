"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { PenIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import updateQuantityAction from "@/app/dashboard/products/[slug]/_actions/update-quantity-action";
import { Input } from "@/components/ui/input";

type UpdateQuantityProps = {
  productId: string | null;
  quantity: number | null;
};

const formSchema = z.object({
  quantity: z.number().nullable(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateQuantity({
  productId,
  quantity,
}: UpdateQuantityProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity,
    },
  });

  const displayButtonText = !productId ? "Добавяне" : "Промяна";
  const displayFormButtonText = !productId ? "Добавяне" : "Запазване";

  const onSubmit = async (values: FormSchemaProps) => {
    if (!productId) {
      return toast.error("Този продукт не е намерен");
    }

    const result = await updateQuantityAction(productId, values.quantity);

    if (result.error) {
      return toast.error(result.error);
    }

    setIsOpen(false);
    toast.success(result.message);
    router.refresh();
  };

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Количество</div>
        {quantity ? (
          <div>{quantity === 1 ? `${quantity} брой` : `${quantity} броя`}</div>
        ) : (
          <div className="text-muted-foreground">Няма описание</div>
        )}
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Напишете количество на продукта"
                      {...field}
                      value={field.value ?? ''}
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
                {form.formState.isSubmitting
                  ? "Зареждане..."
                  : displayFormButtonText}
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
        <div className="flex gap-5">
          <Button onClick={() => setIsOpen(true)}>
            <PenIcon />
            {displayButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
