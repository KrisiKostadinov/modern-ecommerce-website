"use server";

import { prisma } from "@/db/prisma";
import { FormSchemaProps } from "@/app/dashboard/email-templates/_components/save-client-page";

export default async function saveAction(id: string | undefined, emailTemplate: FormSchemaProps) {
  if (emailTemplate.key) {
    const foundedEmailTemplate = await prisma.emailTemplate.findFirst({
      where: { key: emailTemplate.key }
    });
    
    if (foundedEmailTemplate && foundedEmailTemplate.id !== id) {
      return { error: "Този ключ вече се използва от друг имейл темплейт" };
    }
  }

  if (id) {
    const updatedEmailTemplate = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: emailTemplate.name,
        description: emailTemplate.description,
        code: emailTemplate.code || "",
        key: emailTemplate.key || "",
      },
    });
    
    if (!updatedEmailTemplate) {
      return { error: "Този имейл темплейт не е намерен" };
    }
    
    return { updatedEmailTemplate, message: "Промените са запазени" };
  }
  
  const createdEmailTemplate = await prisma.emailTemplate.create({
    data: {
      name: emailTemplate.name,
      description: emailTemplate.description,
      code: emailTemplate.code || "",
      key: emailTemplate.key || "",
    },
  });

  return { createdEmailTemplate, message: "Имейл темплейтът е създаден" };
}
