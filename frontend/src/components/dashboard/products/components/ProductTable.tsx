import { FailedToLoad, Loading } from "@/components/global";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls, RatingStars, Thumbnail } from "@/components/util";
import { usePageControls } from "@/hooks";
import { getThumbnailFromFirebase } from "@/lib/firebase";
import { applyDiscount, cn, formatDateWithTime, getStatus, goto } from "@/lib/utils";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function ProductTable({ data, viewToggle, pageError, amountError }) {
  const { handlePageChange, calculateShowingRange, currentPage } = usePageControls(data);
  const [thumbnail, setThumbnail] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchThumbnail = async () => {
      setLoading(true); // Set loading state to true when fetching thumbnails
      if (data?.content?.length > 0) {
        const promises = data.content.map(async (item) => {
          const thumbnail = await getThumbnailFromFirebase(item.productId);
          return thumbnail.url;
        });
        const thumbnails = await Promise.all(promises);
        setThumbnail(thumbnails);
      }
      setLoading(false);
    };

    fetchThumbnail();
  }, [data]);

  if (pageError || amountError) {
    return <FailedToLoad text="products" />;
  }

  if (loading) {
    return <Loading text="product" />;
  }

  return (
    <>
      {thumbnail.length > 0 && viewToggle === "list" && (
        <>
          <Table className="table-auto w-full">
            <TableCaption className="text-wrap">
              <span>
                Showing {calculateShowingRange()} of <strong>{data.totalElements}</strong> products
              </span>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] text-center">Product</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center lg:table-cell hidden">Created on</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.content?.map((item, index) => (
                <TableRow key={index} className="hover:cursor-pointer" onClick={() => goto(`products/edit/${item.productId}`)}>
                  <TableCell className="relative flex flex-row gap-6">
                    <Thumbnail url={thumbnail[index]} intristicSize={96} className="!size-20 lg:flex hidden flex-shrink-0" />

                    {item.discount > 0 && (
                      <div className="absolute top-0 left-0 mt-1 mr-1 px-2 py-1 bg-destructive text-white rounded-md text-xs font-bold lg:block hidden">
                        -{item.discount}%
                      </div>
                    )}
                    <div className="flex flex-col text-start gap-0.5">
                      <span className="font-semibold md:w-56 w-48">{item.name}</span>
                      <span className="text-sm">{item.category.name}</span>
                      <RatingStars rating={5} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn("font-bold flex flex-row md:gap-2 justify-center")}>
                      {item.discount > 0 && (
                        <div
                          className={cn("font-bold md:block hidden text-end", {
                            "font-normal text-muted-foreground": item.discount == 0,
                          })}>
                          ${applyDiscount(item.price, item.discount)}
                        </div>
                      )}
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
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity} pcs</TableCell>
                  <TableCell className="lg:table-cell hidden">{formatDateWithTime(item.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatus(item).color}>{getStatus(item).status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.content && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={data.totalPages}
              handlePageChange={handlePageChange}
              number={data.number}
              marginTop={"mt-[-2.5rem]"}
            />
          )}
        </>
      )}
      {thumbnail.length > 0 && viewToggle === "grid" && (
        <div className="w-full">
          <ResponsiveMasonry columnsCountBreakPoints={{ 360: 1, 700: 2, 1450: 3, 1750: 4, 2050: 5, 2300: 6 }}>
            <Masonry gutter="1rem">
              {data?.content?.map((item, index) => (
                <Card
                  onClick={() => goto(`products/edit/${item.productId}`)}
                  className="hover:shadow-lg transition  hover:cursor-pointer pt-16 md:pt-0"
                  key={index}>
                  <CardContent className="relative">
                    <div className="flex justify-center items-center h-[144px] md:h-[288px]">
                      <Thumbnail url={thumbnail[index]} />

                      {item.discount > 0 && (
                        <div className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-destructive text-white rounded-md text-xs font-bold">
                          {item.discount}% OFF
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-16 md:mt-0">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between w-full">
                        <span className="font-semibold text-start w-56 truncate">{item.name}</span>
                        <div className="flex-shrink-0">
                          <Badge variant={getStatus(item).color}>{getStatus(item).status}</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between w-full mt-2">
                        <span className="text-start text-sm italic">Category:</span>
                        <span className="text-sm">{item.category.name}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-start text-sm italic">Price:</span>
                        <div className="flex flex-row gap-2 items-center">
                          <div className="font-bold text-sm">
                            ${item.discount > 0 ? applyDiscount(item.price, item.discount) : item.price ? item.price : NaN}
                          </div>

                          {item.discount > 0 && (
                            <span
                              className={item.discount > 0 ? "font-normal text-sm text-muted-foreground" : ""}
                              style={{
                                backgroundImage:
                                  item.discount > 0
                                    ? "linear-gradient(to top right, transparent calc(50% - 1px), gray 50%, transparent calc(50% + 1px))"
                                    : "none",
                              }}>
                              ${item.price ? item.price : NaN}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-start text-sm italic">Stock:</span>
                        <span className="text-sm">{item.quantity} pcs</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-start text-sm italic">Created At:</span>
                        <span className="text-sm">{formatDateWithTime(item.createdAt)}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-start text-sm italic">Rating:</span>
                        <RatingStars rating={5} />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </Masonry>
          </ResponsiveMasonry>
          <div className="flex items-center justify-center mt-2 relative">
            <span className="text-muted-foreground text-sm absolute left-0 text-wrap lg:block hidden">
              Showing {calculateShowingRange()} of <strong>{data.totalElements}</strong> products
            </span>

            <div className="flex-grow flex justify-center">
              {data.content && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  handlePageChange={handlePageChange}
                  number={data.number}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
