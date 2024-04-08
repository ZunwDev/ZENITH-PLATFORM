import { API_URL } from "@/lib/api";
import { newAbortSignal } from "@/lib/utils";
import axios from "axios";
import { Battery, Cable, Camera, ChevronDown, Gamepad, Headphones, Laptop, Printer, Smartphone, Watch } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      signal: newAbortSignal(),
    });

    const iconMapping: { [key: string]: JSX.Element } = {
      ["Computers & Tablets"]: <Laptop />,
      ["Smartphones & Accessories"]: <Smartphone />,
      ["Audio & Headphones"]: <Headphones />,
      ["Cameras & Photography"]: <Camera />,
      ["Home Electronics"]: <Printer />,
      ["Gaming & Consoles"]: <Gamepad />,
      ["Cables & Adapters"]: <Cable />,
      ["Power Banks & Chargers"]: <Battery />,
      ["Wearable Technology"]: <Watch />,
    };

    return response?.data?.map((category: { name: string }) => ({
      name: category.name,
      icon: iconMapping[category.name]
        ? React.cloneElement(iconMapping[category.name], {
            className: "size-8 flex-shrink-0 transition stroke-1",
          })
        : null,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default function ViewCategories() {
  interface Category {
    name: string;
    icon?: JSX.Element;
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
    <section className="flex flex-row gap-4 pb-32 md:min-w-[1600px] min-w-[360px] xs:max-md:px-4">
      <div className="flex flex-col gap-2 pb-32 md:w-60 w-full">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex flex-col divide-y">
          {categories.map((item) => (
            <Link
              key={item.name}
              to={`/category/${item.name.toLowerCase().replace(/\s/g, "-")}`}
              className="w-full flex py-2 gap-2 items-center justify-between hover:no-underline text-accent-foreground">
              <div className="flex gap-3 items-center overflow-hidden group">
                {item.icon ? (
                  <div className="bg-accent-foreground/5 rounded-2xl p-1">{item.icon}</div>
                ) : (
                  <div className="bg-accent-foreground/5 rounded-2xl p-1">Default Icon</div>
                )}
                <p className="flex-1 break-words">{item.name}</p>
              </div>
              <ChevronDown className="size-3 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
