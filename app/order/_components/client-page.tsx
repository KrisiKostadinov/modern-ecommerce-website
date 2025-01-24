"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDeliveryData } from "@/app/order/_actions/helper";
import { createOrderAction } from "@/app/order/_actions/create-order";

export const formSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Въведете името и фамилия си в полето" })
    .refine((value) => value.trim().split(" ").length >= 2, {
      message: "Моля, въведете име и фамилия, разделени с интервал",
    }),
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес" }),
  deliveryCity: z
    .string()
    .min(1, { message: "Моля, въведете град за доставка" }),
  deliveryAddress: z.string().min(1, { message: "Въведете адрес за доставка" }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Моля, въведете валиден телефонен номер",
  }),
  isSaveData: z.enum(["yes", "no"]),
  paymentMethod: z.enum(["CASH"]),
  deliveryMethod: z.enum(["STANDART", "EXPRESS"]),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

type ClientPageProps = {
  userDeliveryData: UserDeliveryData | null;
};

export default function ClientPage({ userDeliveryData }: ClientPageProps) {
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: userDeliveryData?.fullname || "",
      email: userDeliveryData?.email || "",
      deliveryCity: userDeliveryData?.deliveryCity || "",
      deliveryAddress: userDeliveryData?.deliveryAddress || "",
      phoneNumber: userDeliveryData?.phoneNumber || "",
      isSaveData: "yes",
      paymentMethod: "CASH",
      deliveryMethod: "STANDART",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await createOrderAction(values);

    if (result.error) {
      toast.error("Нещо се обърка");
      return;
    }
  };

  return (
    <div className="bg-white py-3 px-4 mb-5 border rounded-md shadow space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Име и фамилия</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Въведете името и фамилията си, разделени с интервал.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имейл адрес</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Въведете имейл адресът си.</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Град за доставка</FormLabel>
                <FormControl>
                  <Input {...field} disabled={form.formState.isSubmitting} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Въведете градът, в който искате да бъде направена доставката.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес за доставка</FormLabel>
                <FormControl>
                  <Input {...field} disabled={form.formState.isSubmitting} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Въведете адресът, на който искате да бъде направена
                  доставката.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефонен номер</FormLabel>
                <FormControl>
                  <Input {...field} disabled={form.formState.isSubmitting} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Въведете телефонният си номер за потвърждение на поръчката.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Метод на плащане</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Изберете от падащото меню" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Наложен платеж</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSaveData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Запазване на данните</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Изберете от падащото меню" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Да</SelectItem>
                      <SelectItem value="no">Не</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Ако изберете &quot;Да&quot;, ще можете се възползвате от
                  автоматично попълване на полетата с Вашите данни. Състемата ще
                  запази следните данни: име и фамилия, имейл адрес, адрес за
                  доставка, град за доставка и телефонен номер
                </FormDescription>
              </FormItem>
            )}
          />

          <div>
            Ако направите поръчка, Вие се съгласявате с нашата{" "}
            <Link href={"/privacy-policy"} className="underline font-semibold">
              Политика за поверителност
            </Link>{" "}
            и{" "}
            <Link href={"/terms"} className="underline font-semibold">
              Общите условия
            </Link>
            .
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Зареждане..."
              : "Завършване на поръчката"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
