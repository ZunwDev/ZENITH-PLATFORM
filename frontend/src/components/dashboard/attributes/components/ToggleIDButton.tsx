// @ts-nocheck // ignored because of an type issue, can't use true/false but can use only on/off, and when using on/off
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff } from "lucide-react";

export default function ToggleIDButton({ isShowID = true, setIsShowID }) {
  const isOnOrOff = isShowID ? "on" : "off";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            variant="outline"
            aria-label="Toggle ID"
            onClick={() => setIsShowID(!isShowID)}
            aria-pressed={isOnOrOff}
            data-state={isOnOrOff}>
            {isShowID ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Show IDs</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
