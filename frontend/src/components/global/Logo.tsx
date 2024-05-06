import { cn } from "@/lib/utils";

export default function Logo({ fillColor = "white", className = "" }) {
  return (
    <svg
      viewBox="208.467 204.2467 141.615 121.825"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(`md:size-14 size-12 fill-${fillColor}`, className)}>
      <polygon
        points="467.253 389.231 566.052 335.542 566.052 314.071 467.253 367.766"
        transform="matrix(1, 0, 0, 1, -258.78594970703125, -109.82428741455078)"
      />
      <polygon
        points="467.253 435.895 566.052 382.2 566.052 364.851 467.253 418.54"
        transform="matrix(1, 0, 0, 1, -258.78594970703125, -109.82428741455078)"
      />
      <polygon
        points="510.058 389.231 608.868 335.542 608.868 317.5 510.058 371.196"
        transform="matrix(1, 0, 0, 1, -258.78594970703125, -109.82428741455078)"
      />
      <polygon
        points="608.868 364.165 510.058 417.854 510.058 435.896 608.868 382.2"
        transform="matrix(1, 0, 0, 1, -258.78594970703125, -109.82428741455078)"
      />
    </svg>
  );
}
