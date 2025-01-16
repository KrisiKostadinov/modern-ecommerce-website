"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";

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

import { formSchema, FormSchemaProps } from "@/app/(auth)/register/_schemas";

export default function TheForm() {
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    await signIn("credentials", values);
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Парола</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Въведете паролата си"
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
              ? "Създаване на акаунта"
              : "Зареждане..."}
          </Button>
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            variant={"link"}
            className="w-fit mx-auto mt-5"
          >
            <Link href={"/register"}>Вече имате акаунт?</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
