"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/db/prisma";
import {
  formSchema,
  FormSchemaProps,
} from "@/app/(auth)/password-reset/_schemas";

export async function passwordReset(token: string, userId: string, values: FormSchemaProps) {
  const validationResult = formSchema.safeParse(values);

  if (validationResult.error) {
    return { error: validationResult.error.message };
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("Този потребител не е намерен");
      }

      const foundedToken = await tx.token.findUnique({
        where: {
          token,
          userId,
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
      });

      if (!foundedToken) {
        throw new Error("Този линк за смяна на паролата е изтекъл");
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(values.password, salt);

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          password: passwordHash,
        },
      });

      await tx.token.delete({
        where: { userId, token },
      });

      return updatedUser;
    });

    return { message: "Паролата беше променена", updatedUser: result };
  } catch (error) {
    return { error: (error as Error).message || "Неочаквана грешка" };
  }
}
