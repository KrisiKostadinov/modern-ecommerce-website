import { prisma } from "@/db/prisma";

import Header from "@/app/(root)/_components/header";
import DisplayCategories from "@/app/(root)/_components/display-categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: {
      places: {
        has: "HOME_PAGE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
  });

  return (
    <>
      <Header />
      <DisplayCategories categories={categories} />
      
      <div className="my-5 text-center">
        <Link href={"/categories"}>
          <Button variant={"outline"} size={"lg"}>Преглед на всички</Button>
        </Link>
      </div>
    </>
  );
}
