import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { Dispatch, ReactElement, ReactNode, useState } from "react";
import { Button } from "./button";

const chipStyles =
  "w-fit inline-flex items-center rounded-full px-1 py-0.5 flex-shrink-0 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:border-primary hover:border transition border border-transparent";

const chipGroupStyles = "w-fit inline-flex items-center rounded-full border text-xs px-3 py-1 mx-1";

interface ChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  onRemove?: () => void;
}

interface ChipGroupProps {
  children: ReactNode;
}

interface ChipGroupProps {
  children: ReactNode;
}

interface ChipCloseButtonProps {
  setShowHiddenChips: Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  text: string;
}

const Chip = React.memo(({ className, onRemove, children }: ChipProps) => (
  <button onClick={onRemove} className={cn(chipStyles, className)}>
    <span>{children}</span>
    <div className="bg-accent-foreground/15 flex justify-center items-center rounded-full size-3 ml-1">
      <X className="size-2" />
    </div>
  </button>
));
Chip.displayName = "Chip";

const ChipCloseButton = React.memo(({ setShowHiddenChips, state, text }: ChipCloseButtonProps) => (
  <div className="flex justify-center items-center ml-1">
    <Button variant="link" className="hover:no-underline p-0 h-2" onClick={() => setShowHiddenChips(state)}>
      {text}
    </Button>
  </div>
));

const ChipGroupContent = ({ children }: { children: ReactNode }) => <div className="flex gap-0.5">{children}</div>;
ChipGroupContent.displayName = "ChipGroupContent";

const ChipGroup = ({ children }: ChipGroupProps) => {
  const [showHiddenChips, setShowHiddenChips] = useState(false);
  const chipArray: React.ReactElement<ChipProps>[] = [];
  let title: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === ChipGroupTitle) {
        title = child;
      } else if (child.type === Chip) {
        chipArray.push(child);
      } else if (child.type === ChipGroupContent) {
        const childChips: ReactElement<ChipProps>[] = React.Children.toArray(child.props.children).filter(
          (chip) => React.isValidElement(chip) && chip.type === Chip
        ) as ReactElement<ChipProps>[];
        chipArray.push(...childChips);
      }
    }
  });

  const visibleChips = chipArray.slice(0, 3);
  const hiddenChips = chipArray.slice(3);

  return (
    <div className={chipGroupStyles}>
      {title && <div>{title}</div>}
      <ChipGroupContent>
        {visibleChips}
        {hiddenChips.length > 0 && (
          <>
            {showHiddenChips ? (
              <>
                {hiddenChips}
                <ChipCloseButton setShowHiddenChips={setShowHiddenChips} state={false} text="Show less" />
              </>
            ) : (
              <ChipCloseButton setShowHiddenChips={setShowHiddenChips} state={true} text={`+${hiddenChips.length}`} />
            )}
          </>
        )}
      </ChipGroupContent>
    </div>
  );
};
ChipGroup.displayName = "ChipGroup";

const ChipGroupTitle = ({ children }: { children: ReactNode }) => <div className="font-semibold mr-1">{children}</div>;
ChipGroupTitle.displayName = "ChipGroupTitle";

export { Chip, ChipGroup, ChipGroupContent, ChipGroupTitle };
