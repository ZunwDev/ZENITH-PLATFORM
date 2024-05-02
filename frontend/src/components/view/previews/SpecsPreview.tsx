import { CodeEditor } from "@/components/dashboard/products/components";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function SpecsPreview({ typesSelectedValue, jsonData, parseError, formattedJSON, setJsonData }) {
  return (
    <Card className={cn("hidden", { block: typesSelectedValue })}>
      <CardHeader>
        <CardTitle>Product Specs</CardTitle>
        <CardDescription>These specs are only read-only for easier lookup. The editor is below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {jsonData !== "" && parseError && (
          <Alert variant="destructive">
            <AlertCircle className="size-5" />
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}
        <CodeEditor formattedJSON={formattedJSON} setJsonData={setJsonData} isReadOnly={true} />
      </CardContent>
    </Card>
  );
}
