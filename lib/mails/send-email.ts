"use server";

import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
  allowReply = true,
}: {
  to: string;
  subject: string;
  html: string;
  allowReply?: boolean;
}) {
  if (
    !process.env.EMAIL_SERVER ||
    !process.env.EMAIL_SERVER_USERNAME ||
    !process.env.EMAIL_SERVER_PASSWORD
  ) {
    throw new Error(
      "Липсват задължителни променливи за конфигурация на имейла"
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USERNAME,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    port: Number(process.env.EMAIL_SERVER_PORT) || 465,
  });

  try {
    const emailOptions: nodemailer.SendMailOptions = {
      from: `${process.env.WEBSITE_TITLE} <${process.env.EMAIL_SERVER_USERNAME}>`,
      to,
      subject,
      html,
    };
    
    if (!allowReply) {
      emailOptions.replyTo = `no-reply@${process.env.EMAIL_SERVER_DOMAIN}`;
    }

    const info = await transporter.sendMail(emailOptions);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Грешка при изпращане на имейл:", error);
    return { success: false, error: "Грешка при изпращане на имейл" };
  }
}
