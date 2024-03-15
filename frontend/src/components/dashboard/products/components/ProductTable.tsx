import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getThumbnailFromFirebase } from "@/lib/firebase";
import { applyDiscount, cn, formatDate, goto, shortenText } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export default function ProductTable({ data }) {
  const [thumbnail, setThumbnail] = useState([]);
  const [showingRange, setShowingRange] = useState<ReactNode>();

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (data.content && data.content.length > 0) {
        const promises = data.content.map(async (item) => {
          const thumbnail = await getThumbnailFromFirebase(item.productId);
          return thumbnail.url;
        });
        const thumbnails = await Promise.all(promises);
        setThumbnail(thumbnails);
      }
    };

    fetchThumbnail();
  }, [data]);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;

    const currentPage = data.number + 1;
    const pageSize = data.pageable.pageSize;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, data.totalElements);

    setShowingRange(
      <span>
        <strong>{startItem}</strong>-<strong>{endItem}</strong>
      </span>
    );
  }, [data]);

  return (
    <Table className="relative xs:w-full xs:justify-center xs:px-4">
      <TableCaption className="text-wrap">
        {data.content && data.content.length > 0 ? (
          <span>
            Showing {showingRange} of <strong>{data.totalElements}</strong> products
          </span>
        ) : (
          "No products found. Try changing/removing filters."
        )}
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
        {data.content &&
          data.content.map((item, index) => (
            <TableRow key={index} className="cursor-pointer" onClick={() => goto(`products/edit/${item.productId}`)}>
              <TableCell className="xs:w-32 sm:table-cell hidden">
                <img src={thumbnail[index]} loading="lazy" width={80} height={80} className="size-20 object-contain" alt="" />
              </TableCell>
              <TableCell className="font-bold text-start sm:w-[216px] xs:w-32">{item.name}</TableCell>
              <TableCell className="text-end hidden sm:table-cell">{item.category.name}</TableCell>
              <TableCell className="text-end md:table-cell hidden">{shortenText(item.description)}</TableCell>
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
