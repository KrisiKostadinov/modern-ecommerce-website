import { z } from "zod";

export const formSchema = z.object({
  email: z
    .string()
    .min(2, "Имейл адресът трябва да съдържа поне 2 знака.")
    .max(50, "Имейл адресът не може да бъде по-дълъг от 50 знака."),
});

export type FormSchemaProps = z.infer<typeof formSchema>;