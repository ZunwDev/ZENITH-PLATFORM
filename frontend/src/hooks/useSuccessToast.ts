import { useToast } from "@/components/ui/use-toast";
import { ReactNode } from "react";

export const useSuccessToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string | ReactNode) => {
    toast({
      title: title + " Success",
      description,
    });
  };

  return showSuccessToast;
};
