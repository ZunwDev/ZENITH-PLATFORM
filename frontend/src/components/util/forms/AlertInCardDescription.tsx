import { AlertTriangleIcon } from "lucide-react";
import { ReactNode } from "react";

export default function AlertInCardDescription({ children }: { children: ReactNode }) {
  return (
    <>
      <br />
      <AlertTriangleIcon className="inline-block text-alert size-4" />
      <span className="ml-1 text-alert">{children}</span>
    </>
  );
}
