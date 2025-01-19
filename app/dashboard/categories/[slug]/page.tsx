import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { Category } from "@prisma/client";

import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import ClientPage from "@/app/dashboard/categories/[slug]/_components/client-page";

import UpdateName from "@/app/dashboard/categories/[slug]/_components/update-name";
import UpdateSlug from "@/app/dashboard/categories/[slug]/_components/update-slug";
import UpdateDescription from "@/app/dashboard/categories/[slug]/_components/update-description";
import UploadImage from "@/app/dashboard/categories/[slug]/_components/update-image";
import UpdatePlaces from "@/app/dashboard/categories/[slug]/_components/update-places";

export default async function UpdateCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  let category: Category | null = null;

  const isNew = awaitedParams.slug === "create";
  const heading = isNew ? "Добавяне" : "Редактиране";

  category = await prisma.category.findUnique({
    where: { id: awaitedParams.slug },
  });

  if (!category && !isNew) {
    return redirect("/dashboard/categories");
  }

  const mapedId = category?.id || null;
  const mapedName = category?.name || null;

  return (
    <PageWrapper>
      <ClientPage heading={heading} categoryId={category?.id} />
      
      <div className="grid md:grid-cols-2 gap-5">
        <UpdateName id={mapedId} name={mapedName} />
        {category && <UpdateSlug id={mapedId} slug={category.slug} />}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
        {category && <UpdatePlaces id={category.id} places={category.places} />}
      </div>
      
      <div className="mt-5">
        {category && <UpdateDescription id={mapedId} description={category.description} />}
      </div>

      <div className="my-5">
        {category && <UploadImage id={category.id} imageUrl={category.imageUrl} />}
      </div>
    </PageWrapper>
  );
}
