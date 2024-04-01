import { PaginationControls, Thumbnail } from "@/components/global";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RatingStar from "@/components/util/RatingStars";
import { putUserToFirstPage } from "@/hooks";
import { getThumbnailFromFirebase } from "@/lib/firebase";
import { applyDiscount, cn, formatDateWithTime, getStatus, goto } from "@/lib/utils";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useLocation, useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function ProductTable({ data, viewToggle }) {
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
      {thumbnail.length > 0 && showingRange && viewToggle === "list" && (
        <>
          <Table className="table-auto w-full">
            <TableCaption className="text-wrap">
              {data?.content?.length > 0 ? (
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
      {thumbnail.length > 0 && showingRange && viewToggle === "card" && (
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
                        <span className="text-start text-sm">Category:</span>
                        <span className="text-sm">{item.category.name}</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-start text-sm">Price:</span>
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
                        <span className="text-start text-sm">Stock:</span>
                        <span className="text-sm">{item.quantity} pcs</span>
                      </div>
                      <div className="flex justify-between w-full">
                        <span className="text-start text-sm">Created At:</span>
                        <span className="text-sm">{formatDateWithTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </Masonry>
          </ResponsiveMasonry>
          <div className="flex flex-row mt-2">
            {data?.content?.length > 0 ? (
              <span className="w-64 text-muted-foreground text-sm">
                Showing {showingRange} of <strong>{data.totalElements}</strong> products
              </span>
            ) : (
              <span className="w-fit text-muted-foreground text-sm">No products found. Try changing/removing filters.</span>
            )}
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
      )}
    </>
  );
}
