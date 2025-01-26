"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
import { registerUser } from "@/app/(auth)/register/_actions";

export default function TheForm() {
  const router = useRouter();
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await registerUser(values);

    if (result.error) {
      return toast.error(result.error);
    }

    router.push("/login");
    toast.success(result.message);
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
                  placeholder="Въведете силна парола"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          Ако се регистрирате, Вие се съгласявате с нашата{" "}
          <Link href={"/privacy-policy"} className="underline font-semibold">
            Политика за поверителност
          </Link>{" "}
          и{" "}
          <Link href={"/terms"} className="underline font-semibold">
            Общите условия
          </Link>
          .
        </div>
        <div className="flex flex-col">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {!form.formState.isSubmitting
              ? "Създаване на акаунт"
              : "Зареждане..."}
          </Button>
          <Button
            type="button"
            disabled={form.formState.isSubmitting}
            variant={"link"}
            className="w-fit mx-auto mt-5"
          >
            <Link href={"/login"}>Все още нямате акаунт?</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}