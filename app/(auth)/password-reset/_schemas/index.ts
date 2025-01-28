import { z } from "zod";

export const formSchema = z
  .object({
    password: z
      .string()
      .min(2, "Паролата трябва да съдържа поне 2 знака.")
      .max(50, "Паролата не може да бъде по-дълга от 50 знака."),
    cpassword: z
      .string()
      .min(2, "Паролата трябва да съдържа поне 2 знака.")
      .max(50, "Паролата не може да бъде по-дълга от 50 знака."),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Паролите трябва да съвпадат.",
    path: ["cpassword"],
  });

export type FormSchemaProps = z.infer<typeof formSchema>;
