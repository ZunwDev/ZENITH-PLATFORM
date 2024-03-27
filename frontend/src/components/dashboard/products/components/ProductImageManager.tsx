import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ImageUploader, InformationDescription } from "@/components/util";
import { cn } from "@/lib/utils";
import { BoxSelect, Trash } from "lucide-react";
import { useCallback, useState } from "react";

interface ImageManagerProps {
  images: string[];
  imageThumbnail: string;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setImageThumbnail: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductImageManager({ images, imageThumbnail, setImages, setImageThumbnail }: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState([]);

  const deleteSelectedImages = useCallback(() => {
    setImages((prev) => {
      const updatedImages = prev.filter((item) => !selectedImages.includes(item));
      setSelectedImages([]);
      return updatedImages;
    });
    setImageThumbnail("");
  }, [selectedImages]);

  const selectAllImages = useCallback(() => {
    setSelectedImages((prev) => (prev.length === images.length ? [] : images));
  }, [images]);

  const setImageAsThumbnail = useCallback((image: string) => {
    setImageThumbnail(image);
  }, []);

  const handleImageSelect = useCallback((image: string) => {
    setSelectedImages((prev) => (prev.includes(image) ? prev.filter((item) => item !== image) : [...prev, image]));
  }, []);

  return (
    <Card className="w-full border rounded-md flex flex-col flex-shrink-0">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload images that will represent the product.
          {images.length > 0 && (
            <InformationDescription>
              Images with <strong>a blue border</strong> represent thumbnail. Click any image to change the thumbnail.
            </InformationDescription>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <>
          {images.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="grid md:grid-cols-3 sm:grid-cols-5 grid-cols-4 gap-2 p-2 overflow-y-auto h-full">
                {images.map((item, index) => (
                  <div className="relative group" key={index}>
                    <img
                      title="Click to set as thumbnail"
                      src={item}
                      loading="lazy"
                      className={cn("rounded-md object-contain size-20 cursor-pointer ring-2 ring-accent", {
                        "ring-2 ring-primary": item === imageThumbnail,
                        "group-hover:ring-primary/30": item !== imageThumbnail,
                      })}
                      onClick={() => setImageAsThumbnail(item)}
                    />
                    <div className="absolute top-1 right-6">
                      <Checkbox
                        checked={selectedImages.includes(item)}
                        className={cn(
                          "bg-background",
                          { "group-hover:flex hidden": selectedImages.length == 0 },
                          { flex: selectedImages.length > 0 }
                        )}
                        onClick={() => handleImageSelect(item)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-96">
              <p className="text-lg text-center">No images uploaded yet.</p>
              <p className="text-sm text-accent-foreground/50 text-center">Once you upload images, they will appear here.</p>
            </div>
          )}
        </>
      </CardContent>
      <Separator />
      <CardFooter className="text-sm mx-2 gap-2 p-2 flex flex-col items-start">
        <div className="flex flex-row gap-1.5 items-center w-full justify-between">
          <div className="space-x-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="p-1 size-8"
                    name="selectAll"
                    disabled={images.length == 0}
                    variant={
                      images.length && selectedImages.length > 0 && images.length == selectedImages.length
                        ? "destructive"
                        : undefined
                    }
                    onClick={selectAllImages}>
                    <BoxSelect className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {images.length == selectedImages.length ? <p>Unselect all images</p> : <p>Select all images</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="p-1 size-8 group"
                    name="deleteSelected"
                    variant="outline"
                    disabled={selectedImages.length == 0}
                    onClick={deleteSelectedImages}>
                    <Trash className="size-5 group-hover:text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete all selected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {images.length > 0 && <span className="text-text">{`Selected ${selectedImages.length} of ${images.length}`}</span>}
        </div>
        <ImageUploader setImages={setImages} />
      </CardFooter>
    </Card>
  );
}
