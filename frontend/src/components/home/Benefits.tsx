import { RefreshCcw, Shield, Truck } from "lucide-react";
import { Separator } from "../ui/separator";

export default function Benefits() {
  return (
    <div className="flex flex-wrap xl:gap-20 lg:gap-16 md:gap-12 gap-12 justify-center md:h-14 md:min-w-[1200px] min-w-[360px]">
      <div className="flex flex-row gap-2">
        <Truck className="w-12 h-12" />
        <div className="flex flex-col">
          <strong className="text-lg">Free, next-day delivery</strong>
          <span className="text-destructive">No order minimum.</span>
        </div>
      </div>
      <Separator orientation="vertical" className="md:block hidden" />
      <div className="flex flex-row gap-2">
        <RefreshCcw className="w-12 h-12" />
        <div className="flex flex-col">
          <strong className="text-lg">Free, easy returns</strong>
          <span>Hassle-free and no charge.</span>
        </div>
      </div>
      <Separator orientation="vertical" className="md:block hidden" />
      <div className="flex flex-row gap-2">
        <Shield className="w-12 h-12" />
        <div className="flex flex-col">
          <strong className="text-lg">Price protection promise</strong>
          <span>See a price drop in 14 days? We'll fix it.</span>
        </div>
      </div>
    </div>
  );
}