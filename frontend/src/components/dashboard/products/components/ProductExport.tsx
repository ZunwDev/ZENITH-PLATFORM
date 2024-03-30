import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download } from "lucide-react";

function removeSpecifications(products) {
  return products.map((product) => {
    const { specifications, ...productWithoutSpecs } = product;
    return productWithoutSpecs;
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

  function exportToCSV(products) {
    const flattenedProducts = products.map((product) => flattenObject(product));
    const headers = Object.keys(flattenedProducts[0]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(",")]
        .concat(flattenedProducts.map((product) => headers.map((header) => product[header]).join(",")))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  }

  function exportToJSON(products) {
    const productsWithoutSpecs = removeSpecifications(products);
    const jsonContent = JSON.stringify(productsWithoutSpecs, null, 2);
    const encodedUri = encodeURI("data:text/json;charset=utf-8," + jsonContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.json");
    document.body.appendChild(link);
    link.click();
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
        <DropdownMenuItem onClick={() => exportToCSV(data)}>to CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToJSON(data)}>to JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
