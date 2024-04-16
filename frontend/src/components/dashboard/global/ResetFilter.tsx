import { Button } from "@/components/ui/button";
interface ResetFilterProps {
  onReset: () => void;
  filterAmount: number;
}

export default function ResetFilter({ onReset, filterAmount }: ResetFilterProps) {
  return (
    <>
      {filterAmount > 0 && (
        <Button variant="link" className="text-destructive p-0 pl-2 hover:no-underline" onClick={onReset}>
          Clear all
        </Button>
      )}
    </>
  );
}
