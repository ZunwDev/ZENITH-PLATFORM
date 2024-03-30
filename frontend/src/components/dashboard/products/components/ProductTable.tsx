import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RatingStar from "@/components/util/RatingStars";
import { putUserToFirstPage } from "@/hooks";
import { getThumbnailFromFirebase } from "@/lib/firebase";
import { applyDiscount, cn, formatDateWithTime, goto } from "@/lib/utils";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function ProductTable({ data }) {
  const location = useLocation();
  const navigate = useNavigate();
  putUserToFirstPage();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [thumbnail, setThumbnail] = useState([]);
  const [currentPage, setCurrentPage] = useState("1");
  const [showingRange, setShowingRange] = useState<ReactNode>();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchThumbnail = async () => {
      setLoading(true); // Set loading state to true when fetching thumbnails
      if (data.content && data.content.length > 0) {
        const promises = data.content.map(async (item) => {
          const thumbnail = await getThumbnailFromFirebase(item.productId);
          return thumbnail.url;
        });
        const thumbnails = await Promise.all(promises);
        setThumbnail(thumbnails);
      }
      setLoading(false); // Set loading state to false after fetching thumbnails
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

  const handlePageChange = useCallback(
    (page, event) => {
      event.preventDefault();
      queryParams.set("p", page);
      setCurrentPage(page);
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [queryParams, navigate, location.pathname]
  );

  const paginationItems = [];
  for (let i = 1; i <= Math.min(data.totalPages || 0, 3); i++) {
    paginationItems.push(
      <PaginationItem
        key={i}
        className={cn("cursor-pointer", { "opacity-50 pointer-events-none": currentPage == "1" && data.totalPages == "1" })}>
        <PaginationLink
          href={`?p=${i}`}
          isActive={i === (data.number + 1 || 1)}
          onClick={(event) => handlePageChange(i, event)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Render loading state while fetching data
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-screen text-center w-full">
        <ScaleLoader color="#2563eb" />
        Loading products...
      </div>
    );
  }

  return (
    <>
      {thumbnail.length > 0 && showingRange && (
        <>
          <Table className="table-auto w-full">
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
                <TableHead className="w-[200px] text-center">PRODUCT</TableHead>
                <TableHead className="text-center">PRICE</TableHead>
                <TableHead className="text-center">STOCK</TableHead>
                <TableHead className="text-center lg:table-cell hidden">CREATED AT</TableHead>
                <TableHead className="text-center">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content &&
                data.content.map((item, index) => (
                  <TableRow
                    key={index}
                    className="hover:cursor-pointer"
                    onClick={() => goto(`products/edit/${item.productId}`)}>
                    <TableCell className="relative flex flex-row gap-6">
                      <img
                        src={thumbnail[index]}
                        loading="lazy"
                        width={96}
                        height={96}
                        className="!size-20 object-contain lg:flex hidden flex-shrink-0"
                        alt=""
                      />
                      {item.discount > 0 && (
                        <div className="absolute top-0 left-0 mt-1 mr-1 px-2 py-1 bg-destructive text-white rounded-md text-xs font-bold lg:block hidden">
                          -{item.discount}%
                        </div>
                      )}
                      <div className="flex flex-col text-start gap-0.5">
                        <span className="font-semibold md:w-56 w-48">{item.name}</span>
                        <span className="text-sm">{item.category.name}</span>
                        <RatingStar rating={5} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("font-bold flex flex-row md:gap-2 justify-center")}>
                        <span
                          className={item.discount > 0 ? "font-normal text-muted-foreground text-end" : ""}
                          style={{
                            backgroundImage:
                              item.discount > 0
                                ? "linear-gradient(to top right, transparent calc(50% - 1px), gray 50%, transparent calc(50% + 1px))"
                                : "none",
                          }}>
                          ${item.price}
                        </span>
                        {item.discount > 0 && (
                          <div
                            className={cn("font-bold md:block hidden text-end", {
                              "font-normal text-muted-foreground": item.discount == 0,
                            })}>
                            ${applyDiscount(item.price, item.discount)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity} pcs</TableCell>
                    <TableCell className="lg:table-cell hidden">{formatDateWithTime(item.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={item.archived.archivedId === 1 ? "secondary" : "outline"}>
                        {item.archived.archivedId === 1 ? "Archived" : "Active"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {data.content && (
            <Pagination className="z-50 mt-[-2.5rem]">
              <PaginationContent className="">
                {data.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      className={parseInt(currentPage) <= 1 ? "pointer-events-none opacity-50" : undefined}
                      aria-disabled={parseInt(currentPage) === 1}
                      tabIndex={parseInt(currentPage) <= 1 ? -1 : undefined}
                      href={`?p=${Math.max(1, parseInt(currentPage) - 1)}`}
                      onClick={(event) => handlePageChange(Math.max(1, parseInt(currentPage) - 1), event)}
                    />
                  </PaginationItem>
                )}

                {paginationItems}

                {data.totalPages > 1 && (
                  <PaginationItem>
                    <PaginationNext
                      className={parseInt(currentPage) === data.totalPages ? "pointer-events-none opacity-50" : undefined}
                      aria-disabled={parseInt(currentPage) === data.totalPages}
                      tabIndex={parseInt(currentPage) >= data.totalPages ? -1 : undefined}
                      href={`?p=${Math.min(data.totalPages, parseInt(currentPage) + 1)}`}
                      onClick={(event) => handlePageChange(Math.min(data.totalPages, parseInt(currentPage) + 1), event)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </>
  );
}
