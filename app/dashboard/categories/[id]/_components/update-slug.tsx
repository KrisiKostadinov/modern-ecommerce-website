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
import updateSlugAction from "@/app/dashboard/categories/[id]/_actions/update-slug";

type UpdateSlugProps = {
  id: string | null;
  slug: string | null;
};

const formSchema = z.object({
  slug: z.string().min(1, { message: "Това поле е задължително" }),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateName({ id, slug }: UpdateSlugProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: slug || "",
    },
  });

  const displaySlug = slug ? slug : "Няма";
  const displayButtonText = !id ? "Добавяне" : "Промяна";
  const displayFormButtonText = !id ? "Добавяне" : "Запазване";

  const onSubmit = async (values: FormSchemaProps) => {
    if (!id) {
      return toast.error("Тази категория не е намерена");
    }

    const result = await updateSlugAction(id, values);

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
        <div className="font-semibold">URL адрес</div>
        <div className="text-muted-foreground">{displaySlug}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL адрес</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Напишете URL адрес на категорията"
                      {...field}
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
        <Button onClick={() => setIsOpen(true)}>
          <PenIcon />
          {displayButtonText}
        </Button>
      )}
    </div>
  );
}