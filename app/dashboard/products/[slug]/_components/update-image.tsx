"use client";

import { toast } from "react-toastify";
import Image from "next/image";
import { ImageIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UploadDropzone } from "@/utils/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { uploadImage, deleteImageByProductId } from "@/app/dashboard/products/[slug]/_actions/update-image";
import { Button } from "@/components/ui/button";

type UpdateImageProps = {
  id: string;
  imageUrl: string | null;
};

export default function UploadImage({ id, imageUrl }: UpdateImageProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onRemove = async () => {
    if (!imageUrl) {
      return toast.error("Този продукт няма предна снимка");
    }

    setIsLoading(true);

    const result = await deleteImageByProductId(id);

    if (result.error) {
      setIsLoading(false);
      return toast.error(result.error);
    }

    router.refresh();
    toast.success(result.message);
    setIsLoading(false);
  }

  return (
    <div className="max-w-sm bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Предна снимка</div>
        {!imageUrl ? (
          <div className="w-auto h-[300px] border-2 border-dashed border-gray-200 rounded mt-5">
            <div
              className="w-full h-full flex flex-col justify-center items-center"
              onClick={() => setIsOpen(true)}
            >
              <ImageIcon className="w-40 h-40 text-muted-foreground" />
              <Button variant={"outline"}>Качване на снимка</Button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <Image
              src={imageUrl}
              alt={"Product Preview Image"}
              width={600}
              height={600}
              priority
              className="w-full h-[300px] object-cover"
            />
            <div className="flex gap-5">
              <Button
                variant={"outline"}
                className="mt-5"
                onClick={() => setIsOpen(true)}
                disabled={isLoading}
              >
                <ImageIcon />
                Промяна
              </Button>
              <Button
                variant={"destructive"}
                className="mt-5"
                onClick={onRemove}
                disabled={isLoading}
              >
                <TrashIcon />
                Премахване
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Снимка на продукта</DialogTitle>
            <DialogDescription asChild>
              <div>
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    const imageResponse = res[0];

                    const result = await uploadImage(id, {
                      key: imageResponse.key,
                      size: imageResponse.size,
                      type: imageResponse.type,
                      url: imageResponse.url,
                    });

                    if (result.error) {
                      toast.error(result.error);
                      return;
                    }

                    toast.success(result.message);
                    setIsOpen(false);
                    router.refresh();
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                  }}
                  className="mt-5"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
