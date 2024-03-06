import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getThumbnailFromFirebase } from "@/lib/firebase";
import { applyDiscount, cn, formatDate, goto } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductTable({ data }) {
  const [thumbnail, setThumbnail] = useState([]);

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (data && data.length > 0) {
        const promises = data.map(async (item) => {
          const thumbnail = await getThumbnailFromFirebase(item.productId);
          return thumbnail.url;
        });
        const thumbnails = await Promise.all(promises);
        setThumbnail(thumbnails);
      }
    };

    fetchThumbnail();
  }, [data]);
  return (
    <Table className="relative xs:w-full xs:justify-center xs:px-4">
      <TableCaption className="text-wrap">
        {data && data.length > 0
          ? `A list of existing products - viewing ${data.length} products.`
          : "No products found. Try changing/removing filters."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="sm:text-start text-end sm:table-cell hidden">Thumbnail</TableHead>
          <TableHead className="sm:text-start text-end">Name</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Category</TableHead>
          <TableHead className="text-end md:table-cell hidden">Description</TableHead>
          <TableHead className="text-end hidden sm:table-cell">Rating</TableHead>
          <TableHead className="text-end">Original</TableHead>
          <TableHead className="text-end md:table-cell hidden">Discounted</TableHead>
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
            <TableRow key={index} className="cursor-pointer" onClick={() => goto(`products/edit/${item.productId}`)}>
              <TableCell className="xs:w-32 sm:table-cell hidden">
                <img src={thumbnail[index]} loading="lazy" width={64} height={64} className="size-20 object-contain" />
              </TableCell>
              <TableCell className="font-bold text-start sm:w-[216px] xs:w-32">{item.name}</TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.category.name}</TableCell>
              <TableCell className="text-end md:table-cell hidden">
                {item.description.length > 80 ? `${item.description.slice(0, 80)}...` : item.description}
              </TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.rating}</TableCell>
              <TableCell className={cn("font-bold text-end")}>
                <span
                  className={item.discount > 0 ? "font-normal text-muted-foreground" : ""}
                  style={{
                    backgroundImage:
                      item.discount > 0
                        ? "linear-gradient(to top right, transparent calc(50% - 1px), gray 50%, transparent calc(50% + 1px))"
                        : "none",
                  }}>
                  ${item.price}
                </span>
              </TableCell>
              <TableCell
                className={cn("font-bold text-end md:table-cell hidden", {
                  "font-normal text-muted-foreground": item.discount == 0,
                })}>
                ${applyDiscount(item.price, item.discount)}
              </TableCell>
              <TableCell className="text-end md:table-cell hidden">{item.discount}%</TableCell>
              <TableCell className="text-end">{item.quantity}</TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.brand.name}</TableCell>
              <TableCell className="text-end w-[130px] hidden sm:table-cell">{formatDate(item.createdAt)}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex justify-center">
                  {item.archived.archivedId == 1 ? <Check className="size-5" /> : <X className="size-5" />}
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
