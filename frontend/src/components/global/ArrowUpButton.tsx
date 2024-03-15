import { scrollToTop } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";

export default function ArrowUpButton() {
  return (
    <Button variant="outline" className="fixed bottom-4 right-4 rounded-full shadow size-12" onClick={scrollToTop}>
      <ArrowUp className="" />
    </Button>
  );
}
