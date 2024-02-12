import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ResetFilterProps {
  onReset: () => void;
  filterAmount: number;
}

export default function ResetFilter({ onReset, filterAmount }: ResetFilterProps) {
  return (
    <>
      {filterAmount > 0 && (
        <Button variant="link" className="text-destructive" onClick={onReset}>
          <X className="size-3 mr-2" />
          Clear filters
        </Button>
      )}
    </>
  );
}
