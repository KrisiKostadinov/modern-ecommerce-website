"use client";

import Link from "next/link";
import { Session } from "next-auth";

import { Card, CardHeader } from "@/components/ui/card";
import { Category } from "@prisma/client";
import {
  ArrowUpRightFromSquare,
  LogIn,
  MailIcon,
  PhoneIcon,
  User2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export type ContactsInfo = {
  phone: string;
  email: string;
}

type FooterProps = {
  session: Session | null;
  categories: Category[];
  contactsInfo: ContactsInfo;
};

export default function Footer({ session, categories, contactsInfo }: FooterProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer>
      <Card>
        <CardHeader>
          <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-5">Категории</h2>
                <ul className="flex flex-col gap-2">
                  {categories.map((x, index) => (
                    <li key={index}>
                      <Link href={`/categories/${x.slug}`} title={x.name}>
                        {x.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!session?.user ? (
              <div>
                <h2 className="text-xl font-semibold mb-5">Акаунт</h2>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link
                      href={"/login"}
                      title="Влизане в акаунта"
                      className="flex gap-2"
                    >
                      <LogIn />
                      Влизане в акаунта
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/register"}
                      title="Създаване на акаунт"
                      className="flex gap-2"
                    >
                      <User2 />
                      Създаване на акаунт
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-5">Акаунт</h2>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link
                      href={"/account"}
                      title="Моят акаунт"
                      className="flex gap-2"
                    >
                      <User2 />
                      Моят акаунт
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-5">Правни</h2>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href={"/privacy"}
                    title="Политика на поверителност"
                    className="flex gap-2"
                    target="_blank"
                  >
                    <ArrowUpRightFromSquare />
                    Политика на поверителност
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/terms"}
                    title="Общи условия"
                    className="flex gap-2"
                    target="_blank"
                  >
                    <ArrowUpRightFromSquare />
                    Общи условия
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-5">Информация</h2>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href={`mailto:${contactsInfo.email}`}
                    title="Контакти по имейл"
                    className="flex gap-2"
                  >
                    <MailIcon />
                    {contactsInfo.email}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`tel:${contactsInfo.phone}`}
                    title="Контакти по телефон"
                    className="flex gap-2"
                  >
                    <PhoneIcon />
                    {contactsInfo.phone}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="py-5 text-white bg-gray-900">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Всички права запазени. Изработка на
          сайт от{" "}
          <Link
            href={"https://krisidev.com"}
            title="Уеб дизайн & изработка на сайт"
          >
            krisidev.com
          </Link>
        </p>
      </div>
    </footer>
  );
}
