import { Benefits, AdBanner, FeaturedProductsInEachCategory, ViewCategories } from "@/components/home";

export default function Homepage() {
  return (
    <section className="mt-32 flex flex-col gap-12 px-8 md:min-w-[1200px] max-w-[1200px]">
      <Benefits />
      <AdBanner />
      <FeaturedProductsInEachCategory />
      <ViewCategories />
    </section>
  );
}
