import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
const userId = Cookies.get("userId");

export default function NewProductButton() {
  return (
    <Button className="flex flex-row gap-2 items-center justify-center" asChild>
      <a
        href={`/${userId}/dashboard/products/new`}
        onClick={(e) => {
          e.preventDefault();
          window.location.replace(`/${userId}/dashboard/products/new`);
        }}>
        <span className="text-2xl">+</span>New Product
      </a>
    </Button>
  );
}
