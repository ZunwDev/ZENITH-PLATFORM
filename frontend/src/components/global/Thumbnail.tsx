import { cn } from "@/lib/utils";

export default function Thumbnail({ url, intristicSize = 360, className = "" }) {
  return (
    <>
      {url ? (
        <img
          src={url}
          loading="lazy"
          alt="Product Thumbnail"
          width={intristicSize}
          height={intristicSize}
          className={cn("object-contain hover:cursor-pointer size-[200px]", className)}
        />
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="break-words">No thumbnail image uploaded yet.</p>
        </div>
      )}
    </>
  );
}
