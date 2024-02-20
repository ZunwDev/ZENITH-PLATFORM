"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    isRequired?: boolean;
    htmlFor?: string;
  };

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, isRequired, children, ...props }, forwardedRef) => {
  const classNames = cn(labelVariants(), className);

  return (
    <LabelPrimitive.Root ref={forwardedRef} className={classNames} {...props}>
      {children}
      {isRequired && <span className="ml-0.5 text-red-500">*</span>}
    </LabelPrimitive.Root>
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
