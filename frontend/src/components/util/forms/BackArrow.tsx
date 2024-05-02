import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackArrow({ link }) {
  return (
    <Button variant="outline" className="w-fit md:mb-0" asChild>
      <a href={link}>
        <ArrowLeft className="size-5" />
      </a>
    </Button>
  );
}
