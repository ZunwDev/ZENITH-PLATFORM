import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveAs } from "file-saver";
import { ChevronDown, Download } from "lucide-react";

function adjustData(data) {
  return data.map((product) => {
    const { specifications, brand, category, status, ...productWithoutSpecs } = product;
    const brandName = brand.name;
    const categoryName = category.name;
    const statusName = status.name;

    return {
      ...productWithoutSpecs,
      brand: brandName,
      category: categoryName,
      status: statusName,
    };
  });
}

export default function ProductExport({ data }) {
  function flattenObject(obj) {
    const flattened = {};

    function flatten(innerObj, path = "") {
      for (const key in innerObj) {
        if (typeof innerObj[key] === "object" && innerObj[key] !== null) {
          flatten(innerObj[key], path + key + ".");
        } else {
          flattened[path + key] = innerObj[key];
        }
      }
    }

    flatten(obj);
    return flattened;
  }

  function exportToCSV() {
    const adjustedData = adjustData(data);
    const flattenedProducts = adjustedData.map((product) => flattenObject(product));

    const headers = Object.keys(flattenedProducts[0]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(";")]
        .concat(flattenedProducts.map((product) => headers.map((header) => product[header]).join(";")))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  }

  function exportToJSON() {
    const adjustedData = adjustData(data);
    return saveAs(new Blob([JSON.stringify(adjustedData, null, 2)], { type: "JSON" }), "products.json");
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="group data-[state=open]:bg-accent/50">
        <Button variant="outline" className="flex flex-row gap-1">
          <Download className="size-4" />
          Export
          <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Export options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportToCSV()}>to CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToJSON()}>to JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
