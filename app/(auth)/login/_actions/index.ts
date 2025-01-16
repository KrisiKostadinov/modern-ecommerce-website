"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { FormSchemaProps, formSchema } from "@/app/(auth)/register/_schemas";

export const registerUser = async (values: FormSchemaProps) => {
  const validatedValues = formSchema.safeParse(values);

  if (!validatedValues.success) {
    return { error: "Данните в полетата са невалидни" };
  }

  const isUserExisting = await prisma.user.findUnique({
    where: { email: values.email },
  });

  if (isUserExisting) {
    return { error: "Този потребител вече съществува" };
  }

  const hashedPassword = await bcrypt.hash(values.password, 10);

  await prisma.user.create({
    data: {
      email: values.email,
      password: hashedPassword
    },
  });

  redirect("/login");
};