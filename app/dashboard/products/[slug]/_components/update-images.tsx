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

import {
  uploadImages,
  deleteImagesByProductId,
} from "@/app/dashboard/products/[slug]/_actions/update-images";
import { Button } from "@/components/ui/button";

type UpdateImagesProps = {
  id: string;
  imageUrls: string[];
};

export default function UploadImages({ id, imageUrls }: UpdateImagesProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onRemove = async () => {
    if (imageUrls.length === 0) {
      return toast.error("Този продукт няма предна снимка");
    }

    setIsLoading(true);

    const result = await deleteImagesByProductId(id);

    if (result.error) {
      setIsLoading(false);
      return toast.error(result.error);
    }

    router.refresh();
    toast.success(result.message);
    setIsLoading(false);
  };

  return (
    <div className="bg-white border rounded shadow p-5 space-y-4">
      <div>
        <div className="font-semibold">Допълнителни снимки</div>
        {imageUrls.length === 0 ? (
          <div className="w-auto h-[200px] border-2 border-dashed border-gray-200 rounded mt-5 py-10">
            <div
              className="w-full h-full flex flex-col justify-center items-center"
              onClick={() => setIsOpen(true)}
            >
              <ImageIcon className="w-40 h-40 text-muted-foreground" />
              <Button variant={"outline"}>Качване на снимки</Button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex gap-5">
              {imageUrls.map((imageUrl, index) => (
                <Image
                  src={imageUrl}
                  alt={"Product Preview Image"}
                  width={400}
                  height={400}
                  priority
                  className="max-w-[120px] max-h-[120px] w-full h-full overflow-hidden rounded border object-cover"
                  key={index}
                />
              ))}
            </div>
            <div className="flex gap-5">
              <Button
                variant={"outline"}
                className="mt-5"
                onClick={() => setIsOpen(true)}
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
            <DialogTitle>Допълнителни снимки на продукта</DialogTitle>
            <DialogDescription asChild>
              <div>
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    const imagesResponse = res.map((x) => ({
                      key: x.key,
                      size: x.size,
                      type: x.type,
                      url: x.url,
                    }));
                    const result = await uploadImages(id, imagesResponse);

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