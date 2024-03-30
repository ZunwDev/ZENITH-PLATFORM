import { Banner, Benefits, CategoryList, FeaturedProducts } from "@/components/home";

export default function Homepage() {
  return (
    <section className="mt-32 flex flex-col gap-12 px-8 md:min-w-[1600px] max-w-[1600px] min-w-[360px]">
      <Benefits />
      <Banner />
      <FeaturedProducts />
      <CategoryList />
    </section>
  );
}
