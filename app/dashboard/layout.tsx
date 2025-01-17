import type { Metadata } from "next";
import Navbar from "@/app/dashboard/_components/navbar";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className="bg-slate-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
