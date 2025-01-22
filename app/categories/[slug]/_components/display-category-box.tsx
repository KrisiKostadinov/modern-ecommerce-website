"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type DisplayCategoryBoxProps = {
  category: Category;
}

export const DisplayCategoryBox = ({ category }: DisplayCategoryBoxProps) => {
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const formattedDescription = category.description && category.description.replace(/\n/g, "<br>");
  
  return (
    <div className="bg-white p-5 mt-5 shadow border rounded max-sm:mx-5">
      <div className="flex items-center gap-5">
        {category.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={100}
            height={100}
            priority
            className="border shadow rounded-full object-cover w-[60px] h-[60px]"
          />
        )}
        <h1 className="text-2xl font-semibold">{category.name}</h1>
      </div>
      {formattedDescription && (
        <>
          <div
            className={`mt-4 ${!isShowDescription && "line-clamp-2"}`}
            dangerouslySetInnerHTML={{ __html: formattedDescription }}
          />
          <Button
            onClick={() => setIsShowDescription(!isShowDescription)}
            variant={"outline"}
            className="mt-5"
          >
            {!isShowDescription ? <EyeIcon /> : <EyeOffIcon />}
            {!isShowDescription ? "Показване" : "Скриване"}
          </Button>
        </>
      )}
    </div>
  );
}
