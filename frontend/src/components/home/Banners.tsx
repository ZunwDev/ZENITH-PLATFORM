import { useApiData } from "@/hooks";
import { getImageByIdFromFirebase } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function Banners() {
  let { data, loading, setData } = useApiData("banners/homepage", "", []);

  useEffect(() => {
    const fetchImages = async () => {
      if (data) {
        const updatedData = await Promise.all(
          data.map(async (banner) => {
            try {
              const imageUrl = await getImageByIdFromFirebase("banners", banner.bannerId);
              return { ...banner, imageUrl }; // Merge banner data with image URL
            } catch (error) {
              return banner; // Return the original banner data if image fetching fails
            }
          })
        );

        // Check if the data has changed before calling setData
        if (JSON.stringify(updatedData) !== JSON.stringify(data)) {
          setData(updatedData); // Update the data state with the image URLs
        }
      }
    };

    fetchImages();
  }, [data, setData]); // Include setData in the dependency array

  let verticalBanners = data?.filter((item) => item.aspectRatio === "vertical");
  let horizontalBanners = data?.filter((item) => item.aspectRatio === "horizontal");

  return (
    <>
      {loading && <p>Loading...</p>}
      {data?.length > 0 && (
        <div className="w-full max-h-[1200px] flex flex-row gap-2">
          {[0, 1, 2].map((startIdx) => (
            <div key={startIdx} className="flex flex-col flex-wrap gap-2 rounded-2xl">
              {data.slice(startIdx * 3, (startIdx + 1) * 3).map((item, index) => (
                <img
                  key={index}
                  src={item.imageUrl}
                  alt={`Banner ${startIdx * 3 + index + 1}`}
                  className={cn(
                    "object-fill",
                    { "h-[200px] w-[1600px]": item.aspectRatio === "horizontal" },
                    { "h-[600px] w-[300px]": item.aspectRatio === "vertical" }
                  )} // Each banner occupies one-third of the container width
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
