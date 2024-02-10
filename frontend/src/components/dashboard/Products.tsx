import { API_URL } from "@/lib/constants";
import { Button } from "../ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { applyDiscount } from "../../lib/utils";

interface Product {
  productId: string;
  name: string;
  category: {
    name: string;
  };
  description: string;
  rating: number;
  price: number;
  parsedSpecifications: string;
  quantity: number;
  discount: number;
  brand: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

const getProducts = async () => {
  const response = await fetch(`${API_URL}/products?limit=10`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-24">
      <div className="md:px-0 px-4 flex justify-between flex-row">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold w-full">Products ({products.length})</h1>
          <h2>Manage products for ZENITH store</h2>
        </div>
        <Button className="flex flex-row gap-2 items-center justify-center">
          <span className="text-xl">+</span>New Product
        </Button>
      </div>
      <Table>
        <TableCaption>A list of existing products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Product Description</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Discounted Price</TableHead>
            <TableHead>Discount Percentage</TableHead>
            <TableHead>Specifications</TableHead>
            <TableHead>Available Quantity</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Archived?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item, index) => (
            <TableRow key={index} className="cursor-pointer">
              <TableCell className="font-bold">{item.name}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell className="text-ellipsis">
                {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
              </TableCell>
              <TableCell>{item.rating}</TableCell>
              <TableCell className="font-bold">${item.price}</TableCell>
              <TableCell className="font-bold">${applyDiscount(item.price, item.discount)}</TableCell>
              <TableCell>{item.discount}%</TableCell>
              <TableCell>Open to view</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.brand.name}</TableCell>
              <TableCell>{formatDateTime(item.createdAt)}</TableCell>
              <TableCell>{item.archived ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
