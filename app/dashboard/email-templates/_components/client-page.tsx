"use client";

import { useRouter } from "next/navigation";
import { MenuIcon, SaveIcon } from "lucide-react";

import { EmailTemplate } from "@prisma/client";
import PageHeader from "@/app/dashboard/_components/page-header";
import PageWrapper from "@/app/dashboard/_components/page-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";
import deleteAction from "../_actions/delete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ClientPageProps = {
  emailTemplates: EmailTemplate[];
};

export default function ClientPage({ emailTemplates }: ClientPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onCreate = async () => {
    router.push("/dashboard/email-templates/create");
  };

  const onUpdate = async (id: string) => {
    router.push(`/dashboard/email-templates/${id}`);
  };

  const onDelete = async (id: string) => {
    setIsLoading(true);

    try {
      const result = await deleteAction(id);

      if (result.error) {
        return toast.error(result.error);
      }

      toast.success(result.message);
      router.push("/dashboard/email-templates");
    } catch (error) {
      console.log(error);
      toast.error("Възникна грешка при запазването");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageWrapper>
        <PageHeader
          heading="Имейл темплейти"
          button={{
            text: "Създаване",
            icon: <SaveIcon />,
            callback: onCreate,
          }}
        />
        <ScrollArea className="bg-white border rounded-md py-3 px-4">
          <table className="border-collapse w-full text-left min-w-[768px]">
            <thead>
              <tr className="border">
                <th className="border py-1 px-2">Име</th>
                <th className="border py-1 px-2">Ключ</th>
                <th className="border py-1 px-2">Описание</th>
                <th className="border py-1 px-2">Опции</th>
              </tr>
            </thead>
            <tbody>
              {emailTemplates.length > 0 ? (
                emailTemplates.map((emailTemplate, index) => (
                  <tr key={index}>
                    <td className="max-w-xs border py-1 px-2">
                      {emailTemplate.name}
                    </td>
                    <td className="max-w-xl border py-1 px-2">
                      {emailTemplate.key ? (
                        emailTemplate.key
                      ) : (
                        <div className="text-muted-foreground">Няма</div>
                      )}
                    </td>
                    <td className="max-w-xl border py-1 px-2">
                      {emailTemplate.description ? (
                        emailTemplate.description
                      ) : (
                        <div className="text-muted-foreground">Няма</div>
                      )}
                    </td>
                    <td className="max-w-xl border py-1 px-2">
                      <Popover>
                        <PopoverTrigger>
                          <MenuIcon />
                        </PopoverTrigger>
                        <PopoverContent align="end" className="space-y-1">
                          <h2 className="mb-1">Опции</h2>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start"
                            onClick={() => onUpdate(emailTemplate.id)}
                            disabled={isLoading}
                          >
                            Промяна
                          </Button>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start"
                            onClick={() => onDelete(emailTemplate.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Зареждане..." : "Изтриване"}
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-muted-foreground">
                  <td className="border py-1 px-2" colSpan={3}>
                    Няма намерени записи
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </PageWrapper>
    </>
  );
}