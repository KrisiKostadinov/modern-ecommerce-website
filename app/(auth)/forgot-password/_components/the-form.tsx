"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { formSchema, FormSchemaProps } from "@/app/(auth)/forgot-password/_schemas";
import { forgotPasswordAction } from "@/app/(auth)/forgot-password/_actions";

export default function TheForm() {
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    try {
      const result = await forgotPasswordAction(values);

      if (result.error) {
        return toast.error(result.error);
      }
      
      toast.success(result.message);
    } catch (error) {
      console.log("Грешка при изпращане на линк", error);
      if (error instanceof Error && error.message) {
        return toast.error(error.message || "Грешка при изпращане на линк");
      }

      toast.error("Грешка при изпращане на линк");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имейл адрес</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Въведете имейл адресът си"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {!form.formState.isSubmitting
              ? "Изпращане на линк"
              : "Зареждане..."}
          </Button>
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            variant={"link"}
            className="w-fit mx-auto mt-5"
          >
            <Link href={"/login"}>Спомнихте си паролата?</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
