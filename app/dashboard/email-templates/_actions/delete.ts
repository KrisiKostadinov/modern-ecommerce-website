"use server";

import { prisma } from "@/db/prisma";

export default async function deleteAction(id: string) {
  const deletedEmailTemplate = await prisma.emailTemplate.delete({
    where: { id },
  });

  if (!deletedEmailTemplate) {
    return { error: "Този имейл темплейт не е намерен" };
  }

  return { message: "Имейл темплейтът беше премахнат" };
}
