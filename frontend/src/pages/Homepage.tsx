import Advertisement from "@/components/home/Advertisement";
import Benefits from "@/components/home/Benefits";
import FeaturedProductsInEachCategory from "@/components/home/FeaturedProductsInEachCategory";
import ViewCategories from "@/components/home/ViewCategories";

export default function Homepage() {
  return (
    <div className="mt-32 flex flex-col gap-12 px-8">
      <Benefits />
      <Advertisement />
      <FeaturedProductsInEachCategory />
      <ViewCategories />
    </div>
  );
}
