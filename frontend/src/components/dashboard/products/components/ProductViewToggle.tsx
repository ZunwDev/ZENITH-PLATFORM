import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";
export default function ProductViewToggle({ viewToggle, setViewToggle }) {
  return (
    <Tabs defaultValue={viewToggle}>
      <TabsList>
        <TabsTrigger value="list" onClick={() => setViewToggle("list")}>
          <List className="size-4" />
        </TabsTrigger>
        <TabsTrigger value="card" onClick={() => setViewToggle("card")}>
          <LayoutGrid className="size-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
