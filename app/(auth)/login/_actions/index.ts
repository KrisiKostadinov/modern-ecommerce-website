"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/db/prisma";
import { FormSchemaProps, formSchema } from "@/app/(auth)/login/_schemas";

export const loginAction = async (values: FormSchemaProps) => {
  const validatedValues = formSchema.safeParse(values);

  if (!validatedValues.success) {
    return { error: "Данните в полетата са невалидни" };
  }

  const user = await prisma.user.findUnique({
    where: { email: values.email },
  });

  if (!user) {
    return { error: "Имейл адресът или паролата са невалидни" };
  }
  
  if (!bcrypt.compareSync(values.password, user.password)) {
    return { error: "Имейл адресът или паролата са невалидни" };
  }
  
  return { message: "Влизането беше успешно" };
};
