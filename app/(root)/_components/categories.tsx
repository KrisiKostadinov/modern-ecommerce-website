import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import Image from "next/image";

type DisplayCategoriesProps = {
  categories: Category[];
};

export default function DisplayCategoriesProps({
  categories,
}: DisplayCategoriesProps) {
  return (
    <div className="container mx-auto my-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {categories.map((category, index) => (
        <div key={index} className="bg-white py-3 px-4 border rounded shadow">
          <Link href={`${category.slug}`} className="space-y-2 cursor-pointer">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={400}
                height={300}
                priority
                className="w-auto h-auto object-cover border rounded"
              />
            )}
            <p className="text-muted-foreground line-clamp-2">
              {category.description}
            </p>
            <Button className="w-full" variant={"destructive"}>
              Вижте повече
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
