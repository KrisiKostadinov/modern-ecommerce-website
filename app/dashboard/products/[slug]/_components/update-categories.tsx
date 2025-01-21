"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { toast } from "react-toastify";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import { updateCategories } from "@/app/dashboard/products/[slug]/_actions/update-categories";

type UpdateCategoriesProps = {
  productId: string;
  productCategories: Category[];
  categories: Category[];
};

export default function UpdateCategories({
  productId,
  productCategories,
  categories,
}: UpdateCategoriesProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(productCategories);

  const setCategory = (category: Category) => {
    const foundedCategory = selectedCategories.find(
      (c) => c.id === category.id
    );

    if (!foundedCategory) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    }
  };

  const onConfirm = async () => {
    const categoryIds = selectedCategories.map((category) => category.id);
    setIsLoading(true);

    const result = await updateCategories(productId, categoryIds);

    if (result.error) {
      setIsLoading(false);
      return toast.error(result.error);
    }

    setIsLoading(false);
    toast.success(result.message);
  };

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Категории на продукта</div>
        <div
          className="flex flex-wrap items-center gap-5 border rounded py-2 px-4 mt-5 min-h-12"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCategories.length > 0 ? (
            <>
              {selectedCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-full py-1 px-3"
                >
                  {category.name}
                </div>
              ))}
            </>
          ) : (
            <div className="text-muted-foreground">
              Няма избрани категории на този продукт
            </div>
          )}
        </div>
        <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[300px] justify-start mt-1">
              <div className="flex items-center gap-2">
                <ChevronsUpDown size={16} />
                <span>Промяна</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] max-h-[300px] overflow-y-auto p-0"
            align="start"
          >
            <CategoryList
              setCategory={setCategory}
              categories={categories}
              selectedCategories={selectedCategories}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={onConfirm} disabled={isLoading}>
        {isLoading ? "Зареждане..." : "Запазване"}
      </Button>
    </div>
  );
}

type CategoryListProps = {
  setCategory: (category: Category) => void;
  categories: Category[];
  selectedCategories: Category[];
};

const CategoryList = ({
  setCategory,
  selectedCategories,
  categories,
}: CategoryListProps) => {
  const isSelected = (category: Category) => {
    return selectedCategories.find((c) => c.id === category.id);
  };

  return (
    <>
      {categories.length > 0 ? (
        <div className="flex flex-col gap-1 py-1 px-2">
          {categories.map((category, index) => (
            <div
              className={cn(
                "py-2 px-4 border rounded hover:bg-slate-100 cursor-pointer flex justify-between items-center",
                isSelected(category) && "bg-slate-100"
              )}
              key={index}
              onClick={() => setCategory(category)}
            >
              {category.name}
              {isSelected(category) && <CheckIcon />}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-2 px-4 text-muted-foreground">Няма категории</div>
      )}
    </>
  );
};
