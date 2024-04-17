import { XCircle } from "lucide-react";

export default function FailedToLoad({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-screen text-center w-full">
      <XCircle color="red" className="size-24" />
      There was an issue when loading {text}. Try again in few seconds...
    </div>
  );
}
