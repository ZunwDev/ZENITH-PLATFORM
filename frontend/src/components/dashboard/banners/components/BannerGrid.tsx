import { Loading } from "@/components/global";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PaginationControls, Thumbnail } from "@/components/util";
import { usePageControls } from "@/hooks";
import { getImagesFromFirebase } from "@/lib/firebase";
import { getStatus, goto } from "@/lib/utils";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function BannerGrid({ data }) {
  const { handlePageChange, calculateShowingRange, currentPage } = usePageControls(data);
  const [thumbnail, setThumbnail] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchThumbnail = async () => {
      setLoading(true); // Set loading state to true when fetching thumbnails
      if (data?.content?.length > 0) {
        const promises = data.content.map(async (item) => {
          const thumbnail = await getImagesFromFirebase("banners", item.bannerId);
          return thumbnail;
        });
        const thumbnails = await Promise.all(promises);
        setThumbnail(thumbnails);
      }
      setLoading(false);
    };

    fetchThumbnail();
  }, [data]);

  if (loading) {
    return <Loading text="banners" />;
  }

  return (
    <div className="w-full">
      <ResponsiveMasonry columnsCountBreakPoints={{ 360: 1, 700: 2, 1450: 3, 1750: 4, 2050: 5, 2300: 6 }}>
        <Masonry gutter="1rem">
          {data?.content?.map((item, index) => (
            <Card
              onClick={() => goto(`banners/edit/${item.bannerId}`)}
              className="hover:shadow-lg transition  hover:cursor-pointer pt-16 md:pt-0"
              key={index}>
              <CardContent className="relative">
                <div className="flex justify-center items-center h-[144px] md:h-[288px]">
                  <Thumbnail url={thumbnail[index]} />
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
                    <span className="text-start text-sm">Position:</span>
                    <span className="text-sm">{item.position.capitalize()}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-start text-sm">Aspect Ratio:</span>
                    <span className="text-sm">{item.aspectRatio.capitalize()}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-start text-sm">Activation Date:</span>
                    <span className="text-sm font-bold">{item.activationDate}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-start text-sm">Expiration Date:</span>
                    <span className="text-sm font-bold">{item.expirationDate}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-start text-sm">Includes Button?:</span>
                    <span className="text-sm">{item.includeButton.toString()}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      <div className="flex items-center justify-center mt-2 relative">
        <span className="text-muted-foreground text-sm absolute left-0 text-wrap lg:block hidden">
          Showing {calculateShowingRange()} of <strong>{data.totalElements}</strong> banners
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
  );
}
