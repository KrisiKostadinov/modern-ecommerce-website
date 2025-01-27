"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
import { loginAction } from "@/app/(auth)/login/_actions";

export default function TheForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      const errorMessage =
        error === "CredentialsSignin"
          ? "Имейл адресът или паролата са невалидни"
          : "Възникна неочаквана грешка. Моля, опитайте отново.";
      toast.error(errorMessage);
    }
  }, []);

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    try {
      const result = await loginAction(values);

      if (result.error) {
        return toast.error(result.error);
      }

      toast.success(result.message);
      await signIn("credentials", values);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Нещо се случи");
      }
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
              ? "Влизане на акаунта"
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
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            variant={"link"}
            className="w-fit mx-auto"
          >
            <Link href={"/forgot-password"}>Забравили сте паролата си?</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
