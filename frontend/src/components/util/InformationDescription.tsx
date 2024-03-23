import { InfoIcon } from "lucide-react";
import { ReactNode } from "react";

export default function InformationDescription({ children }: { children: ReactNode }) {
  return (
    <>
      <InfoIcon className="inline-block text-primary size-4" />
      <span className="ml-1 text-primary">{children}</span>
    </>
  );
}
