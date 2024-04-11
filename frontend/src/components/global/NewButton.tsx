import { Button } from "@/components/ui/button";
import { useGetSessionData } from "@/hooks";
import { cn } from "@/lib/utils";
import React from "react";

export default function NewButton({ path, icon, type, className = "" }) {
  const sessionData = useGetSessionData();
  if (!sessionData) return;

  return (
    <Button className={cn("sm:flex flex-row gap-2 items-center justify-center", className)} asChild>
      <a
        href={`/${sessionData.userId}/dashboard/${path}/new`}
        onClick={(e) => {
          e.preventDefault();
          window.location.replace(`/${sessionData.userId}/dashboard/${path}/new`);
        }}>
        {icon && React.cloneElement(icon, { className: "size-4" })}
        New {type}
      </a>
    </Button>
  );
}
