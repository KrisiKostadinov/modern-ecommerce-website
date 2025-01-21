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
import updateMetaKeywords from "@/app/dashboard/products/[slug]/_actions/update-meta-keywords";
import { Textarea } from "@/components/ui/textarea";
import { replaceNewlinesWithComma } from "@/lib/utils";

type UpdateNameProps = {
  productId: string;
  metaKeywords: string | null;
};

const formSchema = z.object({
  metaKeywords: z.string().nullable(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateMetaKeywords({ productId, metaKeywords }: UpdateNameProps) {
  const [isOpen, setIsOpen] = useState<boolean>(!!!productId);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metaKeywords,
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await updateMetaKeywords(productId, values.metaKeywords);

    if (result.error) {
      return toast.error(result.error);
    }

    setIsOpen(false);
    toast.success(result.message);

    if (result.updatedProduct) {
      router.refresh();
    }
  };

  const displayMetaKeywords = metaKeywords ? replaceNewlinesWithComma(metaKeywords) : "Няма";

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Мета ключови думи на продукта</div>
        <div className="text-muted-foreground">{displayMetaKeywords}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Мета ключови думи на продукта</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Напишете мета ключови думи всяка на нов ред"
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                      rows={10}
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
