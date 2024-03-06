import { API_URL } from "@/lib/constants";
import { Battery, Cable, Camera, Gamepad, Headphones, Laptop, Printer, Smartphone, Watch } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { newAbortSignal } from "@/lib/utils";

const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`, {
    signal: newAbortSignal(),
  });
  type IconMapping = {
    [key: string]: JSX.Element;
  };

  const iconMapping: IconMapping = {
    ["Computers & Laptops"]: <Laptop />,
    ["Smartphones & Accessories"]: <Smartphone />,
    ["Audio & Headphones"]: <Headphones />,
    ["Cameras & Photography"]: <Camera />,
    ["Home Electronics"]: <Printer />,
    ["Gaming & Consoles"]: <Gamepad />,
    ["Cables & Adapters"]: <Cable />,
    ["Power Banks & Chargers"]: <Battery />,
    ["Wearable Technology"]: <Watch />,
  };

  const categoriesWithIcons = response.data.map((category: { name: string | number }) => ({
    name: category.name,
    icon: React.cloneElement(iconMapping[category.name], {
      className: "md:w-16 md:h-16 w-12 h-12 group-hover:stroke-primary transition",
    }),
  }));
  return categoriesWithIcons;
};

export default function ViewCategories() {
  interface Category {
    name: string;
    icon: JSX.Element;
  }

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-32 md:min-w-[1200px]">
      <h1 className="text-3xl font-bold md:px-0 px-4">What are you looking for?</h1>
      <div className="flex flex-wrap gap-4">
        {categories.map((item) => (
          <Button
            key={item.name}
            className="md:w-[227px] w-[150px] flex md:h-40 h-24 flex-col border hover:scale-105 hover:shadow-xl transition group"
            variant="ghost"
            asChild>
            <Link to={`/category/${item.name.toLowerCase().replace(/\s/g, "-")}`}>
              <div className="md:text-lg text-wrap group-hover:font-semibold group-hover:underline flex flex-col gap-2 items-center justify-center text-center">
                {item.icon}
                {item.name}
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
