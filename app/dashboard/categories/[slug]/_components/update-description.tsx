"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { PenIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import updateDescriptionAction from "@/app/dashboard/categories/[slug]/_actions/update-description";

type UpdateDescriptionProps = {
  id: string | null;
  description: string | null;
};

const formSchema = z.object({
  description: z.string(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdateDescription({ id, description }: UpdateDescriptionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const displaySlug = description ? description : "Няма";
  const displayButtonText = !id ? "Добавяне" : "Редактиране";
  const displayFormButtonText = !id ? "Добавяне" : "Запазване";

  const onSubmit = async (values: FormSchemaProps) => {
    if (!id) {
      return toast.error("Тази категория не е намерена");
    }

    const result = await updateDescriptionAction(id, values);

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
        <div className="font-semibold">Описание</div>
        <div className="text-muted-foreground">{displaySlug}</div>
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Напишете описание на категорията"
                      {...field}
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
