"use server";

import bcrypt from "bcryptjs";

import { formSchema, FormSchemaProps } from "@/app/(auth)/register/_schemas";
import { replaceVariables } from "@/lib/mails/helper";
import { sendEmail } from "@/lib/mails/send-email";
import { prisma } from "@/db/prisma";
import { generateToken, generateConfirmationLink } from "@/app/(auth)/_actions";

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

  const numberOfUsers = await prisma.user.count();

  const role = numberOfUsers === 0 ? "ADMIN" : "USER";

  const token = await generateToken();
  
  try {
    await prisma.$transaction(async (prismaTransaction) => {
      const createdUser = await prismaTransaction.user.create({
        data: {
          email: values.email,
          password: hashedPassword,
          role,
        },
      });

      await prismaTransaction.token.create({
        data: {
          token,
          userId: createdUser.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const link = await generateConfirmationLink(createdUser.id, token);

      const emailValues = {
        website_name: process.env.WEBSITE_TITLE || "",
        website_url: process.env.NEXT_PUBLIC_SITE_URL || "",
        current_year: new Date().getFullYear().toString() || "",
        email: values.email || "",
        link: link,
        website_email: process.env.NEXT_PUBLIC_SITE_URL || "",
        support_email: process.env.ADMIN_SUPPORT_EMAIL || "",
        support_phone: process.env.ADMIN_SUPPORT_PHONE || "",
      };

      const emailTemplate = await prisma.emailTemplate.findFirst({
        where: { key: "email-confirmation" },
      });

      if (!emailTemplate || !emailTemplate.code) {
        return { error: "Имейл темплейтът не е намерен" };
      }

      const replacedHtml = replaceVariables(emailTemplate.code, emailValues);

      if (!replacedHtml.success) {
        throw new Error(replacedHtml.result);
      }

      const result = await sendEmail({
        to: values.email,
        subject: "Потвърждение на имейл",
        html: replacedHtml.result,
        allowReply: false,
      });

      if (result.error) {
        throw new Error(result.error);
      }
    });

    return { message: "Профилът беше създаден" };
  } catch (error) {
    console.error("Грешка при регистрация на потребител:", error);
    return { error: "Грешка при регистрация на потребител" };
  }
};