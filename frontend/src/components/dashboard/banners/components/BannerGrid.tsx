import { FailedToLoad, Loading } from "@/components/global";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PaginationControls, Thumbnail } from "@/components/util";
import { usePageControls } from "@/hooks";
import { getImagesFromFirebase } from "@/lib/firebase";
import { goto } from "@/lib/utils";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { InfoRow } from "../../global";

export default function BannerGrid({ data, pageError }) {
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

  if (pageError) {
    return <FailedToLoad text="banners" />;
  }

  if (loading) {
    return <Loading text="banner" />;
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
                  <div className="flex justify-between w-full mb-2">
                    <span className="font-semibold text-start w-56 truncate">{item.name}</span>
                    <div className="flex-shrink-0">
                      <Badge variant={item.status.color}>{item.status.name}</Badge>
                    </div>
                  </div>
                  <InfoRow label="Position" value={item.position.capitalize()} />
                  <InfoRow label="Aspect Ratio" value={item.aspectRatio.capitalize()} />
                  <InfoRow label="Activation Date" value={item.activationDate} isBold />
                  <InfoRow label="Expiration Date" value={item.expirationDate} isBold />
                  <InfoRow label="Includes Button?" value={item.includeButton.toString()} />
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
