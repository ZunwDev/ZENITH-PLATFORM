import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InformationDescription } from "@/components/util";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

interface BannerPreviewProps {
  image: string;
  form: ReturnType<typeof useForm>;
}

export default function BannerPreview({ image, form }: BannerPreviewProps) {
  const { name, aspect_ratio, link, include_button } = form.getValues();
  const renderBannerContent = () => {
    if (!image) {
      return (
        <div>
          <p className="text-lg text-center">No banner uploaded yet.</p>
          <p className="text-sm text-accent-foreground/50 text-center">Once you upload banner, it will appear here.</p>
        </div>
      );
    }

    return (
      <div
        title={name}
        className={cn(
          { "h-[200px] w-[1200px] relative": aspect_ratio === "horizontal" },
          { "h-[600px] w-[200px] relative": aspect_ratio === "vertical" }
        )}>
        <a href={link && !include_button ? link : undefined}>
          <img src={image} className="w-full h-full rounded-lg" alt="Preview image" />
        </a>
        {include_button && (
          <Button className="absolute bottom-8 left-8" variant="outline" asChild>
            <a href={link}>More information</a>
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner Preview</CardTitle>
        <CardDescription>
          This is a real-time preview of the banner. Depending on the aspect ratio selected:
          <InformationDescription>Horizontal aspect ratio size = 1200px x 200px.</InformationDescription>
          <InformationDescription>Vertical aspect ratio size = 200px x 600px.</InformationDescription>
        </CardDescription>
        <CardContent className="flex justify-center items-center bg-muted/40 p-32 rounded-lg">
          {renderBannerContent()}
        </CardContent>
      </CardHeader>
    </Card>
  );
}
