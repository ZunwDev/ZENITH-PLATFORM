import Benefits from "@/components/home/Benefits";
import ViewCategories from "@/components/home/ViewCategories";

export default function Homepage() {
  return (
    <div className="mt-32 flex flex-col gap-24 px-8">
      <Benefits />
      <ViewCategories />
    </div>
  );
}
