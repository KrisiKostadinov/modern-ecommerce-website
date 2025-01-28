"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { formSchema, FormSchemaProps } from "@/app/(auth)/password-reset/_schemas";
import { passwordReset } from "@/app/(auth)/password-reset/_actions";

type TheFormProps = {
  token: string;
  id: string;
}

export default function TheForm({ token, id }: TheFormProps) {
  const router = useRouter();
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      cpassword: "",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await passwordReset(token, id, values);

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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нова парола</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Въведете нова сигурна парола"
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
          name="cpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Потвърдете паролата</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Въведете отново новата парола"
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
              ? "Смяна на паролата"
              : "Зареждане..."}
          </Button>
        </div>
      </form>
    </Form>
  );
}