"use server";

import { formSchema, FormSchemaProps } from "@/app/(auth)/forgot-password/_schemas";
import { prisma } from "@/db/prisma";
import { generateToken, generateConfirmationLink } from "@/app/(auth)/_actions";
import { replaceVariables } from "@/lib/mails/helper";
import { sendEmail } from "@/lib/mails/send-email";

export async function forgotPasswordAction(values: FormSchemaProps) {
  const validationResult = formSchema.safeParse(values);

  if (validationResult.error) {
    return { error: validationResult.error.message || "Въведените данни са невалидни" };
  }

  const user = await prisma.user.findUnique({
    where: { email: values.email },
  });

  if (!user) {
    return { error: "Този имейл адрес не е намерен" };
  }

  const token = await generateToken(512);
  const link = await generateConfirmationLink(user.id, token, "password-reset");

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
    where: { key: "forgot-password" },
  });

  if (!emailTemplate || !emailTemplate.code) {
    return { error: "Имейл темплейтът не е намерен" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.token.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const replacedHtml = replaceVariables(emailTemplate.code, emailValues);

      if (!replacedHtml.success) {
        throw new Error(replacedHtml.result);
      }

      const result = await sendEmail({
        to: values.email,
        subject: "Забравена парола",
        html: replacedHtml.result,
        allowReply: false,
      });

      if (result.error) {
        throw new Error(result.error);
      }
    });

    return { message: "Линкът беше изпратен" };
  } catch (error) {
    return { error: (error as Error).message || "Възникна грешка при изпълнението" };
  }
}
