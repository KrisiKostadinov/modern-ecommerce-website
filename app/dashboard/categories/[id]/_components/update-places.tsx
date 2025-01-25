"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SaveIcon } from "lucide-react";

import { CategoryPlace } from "@prisma/client";
import updatePlaceAction from "@/app/dashboard/categories/[id]/_actions/update-places";
import { Button } from "@/components/ui/button";

const allPlaces: CategoryPlace[] = ["HOME_PAGE", "CATEGORIES_PAGE", "NAVBAR", "FOOTER"];

const mapPlace = (place: CategoryPlace) => {
  const places = {
    HOME_PAGE: "Начална страница",
    CATEGORIES_PAGE: "Страница с категории",
    NAVBAR: "Навигационна лента",
    FOOTER: "Долната част на сайта",
  };

  return places[place];
}

type UpdatePlacesProps = {
  id: string;
  places: CategoryPlace[];
};

const formSchema = z.object({
  places: z.array(z.nativeEnum(CategoryPlace)),
});

export type FormSchemaProps = z.infer<typeof formSchema>;

export default function UpdatePlaces({ id, places }: UpdatePlacesProps) {
  const router = useRouter();

  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      places,
    },
  });

  const onSubmit = async (values: FormSchemaProps) => {
    const result = await updatePlaceAction(id, values.places);

    if (result.error) {
      return toast.error(result.error);
    }

    toast.success(result.message);

    if (result.updatedCategory) {
      router.refresh();
    }
  };

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Места на показване</div>
        <div className="text-muted-foreground">
          На следните места в уеб сайта Ви, ще се показва тази категория.
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {allPlaces.map((place) => (
            <label key={place} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={place}
                {...form.register("places")}
                defaultChecked={places.includes(place as CategoryPlace)}
              />
              <span>{mapPlace(place)}</span>
            </label>
          ))}
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          <SaveIcon />
          {form.formState.isSubmitting ? "Зареждане..." : "Запазване"}
        </Button>
      </form>
    </div>
  );
}