import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { ToastContainer } from "react-toastify";
import { prisma } from "@/db/prisma";
import { getCartItems } from "./cart/_actions/helper";
import Footer from "@/components/footer";
import { DevelopmentNotice } from "@/components/development-notice";

export const metadata: Metadata = {
  title: `${process.env.WEBSITE_SLOGUN} - ${process.env.WEBSITE_TITLE}`,
  description: "Намери уникални подаръци за всяка специална личност и момент.",
  robots: "noindex, nofollow",
  openGraph: {
    title: `${process.env.WEBSITE_SLOGUN} - ${process.env.WEBSITE_TITLE}`,
    description: "Намери уникални подаръци за всяка специална личност и момент.",
    locale: "bg",
    images: [
      {
        url: "/images/logo.png",
        width: 1333,
        height: 2000,
      }
    ],
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const cartItems = await getCartItems();

  await prisma.category.findMany({
    where: { places: { has: "NAVBAR" } },
    orderBy: {
      createdAt: "desc",
    },
  });

  const [navbarCategories, footerCategories] = await Promise.all([
    await prisma.category.findMany({
      where: { places: { has: "NAVBAR" } },
      orderBy: {
        createdAt: "desc",
      },
    }),
    await prisma.category.findMany({
      where: { places: { has: "FOOTER" } },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <html lang="bg">
      <body className="bg-slate-100">
        <SessionProvider>
          <ToastContainer />
          <Navbar
            session={session}
            categories={navbarCategories}
            cartItems={cartItems}
          />
          {children}
          <Footer
            session={session}
            categories={footerCategories}
            contactsInfo={{
              phone: process.env.ADMIN_SUPPORT_PHONE || "",
              email: process.env.ADMIN_SUPPORT_EMAIL || "",
            }}
          />
        </SessionProvider>
        <DevelopmentNotice />
      </body>
    </html>
  );
}