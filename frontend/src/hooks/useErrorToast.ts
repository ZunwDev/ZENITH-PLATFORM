import { useToast } from "@/components/ui/use-toast";
import { ReactNode } from "react";

export const useErrorToast = () => {
  const { toast } = useToast();

  const showErrorToast = (title: string, description: string | ReactNode) => {
    toast({
      variant: "destructive",
      title: title !== null ? title + " Error" : "Error occured",
      description,
    });
  };

  return showErrorToast;
};
