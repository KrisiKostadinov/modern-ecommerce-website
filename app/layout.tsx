import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { ToastContainer } from "react-toastify";
import { prisma } from "@/db/prisma";
import { getCartItems } from "./cart/_actions/helper";
import Footer from "@/components/footer";

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
        url: "/images/IMG_20250121_132516_102.jpg",
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
            <DevelopmentNotice />
        </SessionProvider>
      </body>
    </html>
  );
}

export function DevelopmentNotice() {
  return (
    <div className="sticky bottom-0 left-0 w-full bg-yellow-500 text-white text-center p-4 shadow-lg z-50">
      <p className="font-bold text-lg">
        🚧 Сайтът е в процес на разработка. Очаквайте скоро! 🚀
      </p>
    </div>
  );
}
