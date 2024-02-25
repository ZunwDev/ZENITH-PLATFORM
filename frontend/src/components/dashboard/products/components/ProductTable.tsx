import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applyDiscount, formatDate } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Check, X } from "lucide-react";

export default function ProductTable({ data }) {
  return (
    <Table className="relative xs:w-full xs:justify-center xs:px-4">
      <TableCaption className="text-wrap">
        {data && data.length > 0
          ? `A list of existing products - viewing ${data.length} products.`
          : "No products found. Try changing/removing filters."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="sm:text-start text-end">Name</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Category</TableHead>
          <TableHead className="text-end md:table-cell hidden">Description</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Rating</TableHead>
          <TableHead className="text-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>Original</TooltipTrigger>
                <TooltipContent>
                  <p>Original Price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead className="text-end md:table-cell hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>Discounted</TooltipTrigger>
                <TooltipContent>
                  <p>Discounted Price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead className="text-end md:table-cell hidden">Discount</TableHead>
          <TableHead className="text-end">Qty</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Brand</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Creation Date</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Archived?</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((item, index) => (
            <TableRow key={index} className="cursor-pointer">
              <TableCell className="font-bold text-start sm:w-[216px] xs:w-32">{item.name}</TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.category.name}</TableCell>
              <TableCell className="text-end md:table-cell hidden">
                {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
              </TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.rating}</TableCell>
              <TableCell className="font-bold text-end">${item.price}</TableCell>
              <TableCell className="font-bold text-end md:table-cell hidden">
                ${applyDiscount(item.price, item.discount)}
              </TableCell>
              <TableCell className="text-end md:table-cell hidden">{item.discount}%</TableCell>
              <TableCell className="text-end">{item.quantity}</TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.brand.name}</TableCell>
              <TableCell className="text-end w-[130px] hidden sm:table-cell">{formatDate(item.createdAt)}</TableCell>
              <TableCell className="pl-12 hidden sm:table-cell">
                {item.archived ? <Check className="size-5" /> : <X className="size-5" />}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
