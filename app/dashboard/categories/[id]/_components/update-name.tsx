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
import updateNameAction from "@/app/dashboard/categories/[id]/_actions/update-name";

type UpdateNameProps = {
  id: string | null;
  name: string | null;
};

const formSchema = z.object({
  name: z.string(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateName({ id, name }: UpdateNameProps) {
  const [isOpen, setIsOpen] = useState<boolean>(!!!id);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
    },
  });

  const displayName = name ? name : "Няма";
  const displayButtonText = !id ? "Добавяне" : "Промяна";
  const displayFormButtonText = !id ? "Добавяне" : "Запазване";

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await updateNameAction(id, values);

    if (result.error) {
      return toast.error(result.error);
    }

    setIsOpen(false);
    toast.success(result.message);

    if (result.createdCategory) {
      return router.push(`/dashboard/categories/${result.createdCategory.id}`);
    }

    if (result.updatedCategory) {
      router.refresh();
    }
  };

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Име</div>
        <div className="text-muted-foreground">{displayName}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име на категорията</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Напишете име на категорията"
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