import { Button } from "@/components/ui/button";
import { useSuccessToast } from "@/hooks";

export default function DiscardButton({ typeOfDiscard }) {
  const showSuccessToast = useSuccessToast();
  const handleDiscardEdit = () => {
    showSuccessToast("Discard Successful", `The changes to the ${typeOfDiscard} have been successfully discarded.`);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  return (
    <Button variant="outline" onClick={handleDiscardEdit}>
      Discard
    </Button>
  );
}
