import { Benefits, AdBanner, FeaturedProductsInEachCategory, ViewCategories } from "@/components/home";

export default function Homepage() {
  return (
    <div className="mt-32 flex flex-col gap-12 px-8 text-accent-foreground">
      <Benefits />
      <AdBanner />
      <FeaturedProductsInEachCategory />
      <ViewCategories />
    </div>
  );
}
