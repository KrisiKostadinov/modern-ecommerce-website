"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { SaveIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { EmailTemplate } from "@prisma/client";
import saveAction from "@/app/dashboard/email-templates/_actions/save";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader } from "@/components/ui/card";
import CodeEditor from "@/components/ui/code-editor";
import PageHeader from "@/app/dashboard/_components/page-header";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Това поле трябва да съдържа 2 до 50 символа" })
    .max(50, { message: "Това поле не може да съдържа повече от 50 символа" }),
  description: z.string().optional().nullable(),
  code: z.string().nullable(),
  key: z.string().nullable(),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

type UpdateFormProps = {
  emailTemplate?: EmailTemplate;
};

export default function ClientPage({ emailTemplate }: UpdateFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: emailTemplate?.name || "",
      description: emailTemplate?.description || "",
      code: emailTemplate?.code || "",
      key: emailTemplate?.key || "",
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    setIsLoading(true);
    try {
      const result = await saveAction(emailTemplate?.id, values);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        if (result.createdEmailTemplate) {
          return router.push(
            `/dashboard/email-templates/${result.createdEmailTemplate.id}`
          );
        }

        router.push("/dashboard/email-templates");
      }
    } catch (error) {
      console.log(error);
      toast.error("Възникна грешка при запазването");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (code: string | undefined) => {
    if (code) {
      form.setValue("code", code);
    }
  };

  const buttonText = isLoading
    ? "Зареждане..."
    : !emailTemplate
    ? "Създаване"
    : "Запазване";

  return (
    <>
      {emailTemplate ? (
        <PageHeader
          heading="Промяна на темплейт"
          button={{
            icon: <SaveIcon />,
            text: buttonText,
            callback: () => form.handleSubmit(onSubmit)(),
          }}
          loading={isLoading}
        />
      ) : (
        <PageHeader heading="Нов темплейт" />
      )}
      <Card>
        <CardHeader>
          <Form key={emailTemplate?.id} {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Име</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Име на темплейта"
                        aria-label="Име на темплейта"
                        value={field.value ?? ""}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ключ</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Например, email-confirmation"
                        aria-label="Ключ на темплейта"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Описание на темплейта"
                        aria-label="Описание на темплейта"
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {emailTemplate && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({  }) => (
                    <FormItem>
                      <FormLabel>Код на темплейта</FormLabel>
                      <FormControl>
                        <CodeEditor
                          height="90vh"
                          language="html"
                          theme="vs-light"
                          onChange={(code) => handleCodeChange(code)}
                          value={emailTemplate.code}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" disabled={isLoading}>
                <SaveIcon />
                {buttonText}
              </Button>
            </form>
          </Form>
        </CardHeader>
      </Card>
    </>
  );
}