import { cn } from "@/lib/utils";

export default function FilterAmount({ filterAmount }) {
  return (
    <>
      {filterAmount > 0 && (
        <div
          className={cn("bg-primary size-4 rounded-full text-xs flex items-center justify-center text-accent", {
            "px-4": filterAmount > 9,
          })}>
          {filterAmount > 99 ? "99+" : filterAmount}
        </div>
      )}
    </>
  );
}
