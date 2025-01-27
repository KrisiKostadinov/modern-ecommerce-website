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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <Table className="border-collapse w-full text-left min-w-[1280px]">
            <TableHeader>
              <TableRow className="border">
                <TableHead className="border w-[100px]">Име</TableHead>
                <TableHead className="border w-[100px]">Ключ</TableHead>
                <TableHead className="border">Описание</TableHead>
                <TableHead className="border w-[200px]">
                  Добавен HTML код
                </TableHead>
                <TableHead className="border w-[40px]">Опции</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailTemplates.map((emailTemplate, index) => (
                <TableRow className="border" key={index}>
                  <TableCell className="w-[200px] border font-medium">
                    {emailTemplate.name}
                  </TableCell>
                  <TableCell className="w-[200px] border">{emailTemplate.key}</TableCell>
                  <TableCell className="border">
                    {emailTemplate.description &&
                    emailTemplate.description.length > 190
                      ? emailTemplate.description.slice(0, 190) + "..."
                      : emailTemplate.description}
                  </TableCell>
                  <TableCell className="border">
                    {emailTemplate.code ? "Да" : "Не"}
                  </TableCell>
                  <TableCell className="border text-center">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </PageWrapper>
    </>
  );
}
