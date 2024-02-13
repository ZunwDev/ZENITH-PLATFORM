import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { applyDiscount, formatDateTime } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

export default function ProductTable({ data }) {
  return (
    <Table>
      <TableCaption>
        {data.products && data.products.length > 0
          ? "A list of existing products."
          : "No products found. Try changing/removing filters."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-start">Name</TableHead>
          <TableHead className="text-end">Category</TableHead>
          <TableHead className="text-end">Description</TableHead>
          <TableHead className="text-end">Rating</TableHead>
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
          <TableHead className="text-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>Discounted</TooltipTrigger>
                <TooltipContent>
                  <p>Discounted Price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead className="text-end">Discount</TableHead>
          <TableHead className="text-end">Specifications</TableHead>
          <TableHead className="text-end">Quantity</TableHead>
          <TableHead className="text-end">Brand</TableHead>
          <TableHead className="text-end">Creation Date</TableHead>
          <TableHead className="text-end">Archived?</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.products &&
          data.products.map((item, index) => (
            <TableRow key={index} className="cursor-pointer">
              <TableCell className="font-bold text-start w-[216px]">{item.name}</TableCell>
              <TableCell className="text-end">{item.category.name}</TableCell>
              <TableCell className="text-ellipsis text-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-end">
                      {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
                    </TooltipTrigger>
                    <TooltipContent>{item.description}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-end">{item.rating}</TableCell>
              <TableCell className="font-bold text-end">${item.price}</TableCell>
              <TableCell className="font-bold text-end">${applyDiscount(item.price, item.discount)}</TableCell>
              <TableCell className="text-end">{item.discount}%</TableCell>
              <TableCell className="text-end">Open to view</TableCell>
              <TableCell className="text-end">{item.quantity}</TableCell>
              <TableCell className="text-end">{item.brand.name}</TableCell>
              <TableCell className="text-end">{formatDateTime(item.createdAt)}</TableCell>
              <TableCell className="text-end">{item.archived ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
