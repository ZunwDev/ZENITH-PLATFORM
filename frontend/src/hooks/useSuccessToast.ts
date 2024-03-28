import { useToast } from "@/components/ui/use-toast";

export const useSuccessToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title: title + " Success",
      description,
    });
  };

  return showSuccessToast;
};
