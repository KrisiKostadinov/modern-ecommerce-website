"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { PenIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import updateMetaTitle from "@/app/dashboard/products/[slug]/_actions/update-meta-title";

type UpdateNameProps = {
  productId: string;
  metaTitle: string | null;
};

const formSchema = z.object({
  metaTitle: z.string().nullable(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateName({ productId, metaTitle }: UpdateNameProps) {
  const [isOpen, setIsOpen] = useState<boolean>(!!!productId);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metaTitle,
    },
  });

  const displayMetaTitle = metaTitle || "Няма";

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await updateMetaTitle(productId, values.metaTitle);

    if (result.error) {
      return toast.error(result.error);
    }

    setIsOpen(false);
    toast.success(result.message);

    if (result.updatedProduct) {
      router.refresh();
    }
  };

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Мета заглавие на продукта</div>
        <div className="text-muted-foreground">{displayMetaTitle}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Мета заглавие на продукта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Напишете мета заглавие на продукта"
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
                <span>Запазване</span>
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
          <span>Промяна</span>
        </Button>
      )}
    </div>
  );
}
