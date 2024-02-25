import { useToast } from "@/components/ui/use-toast";

export const useSuccessToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string, desc: string) => {
    toast({
      title: title + " Success",
      description: desc,
    });
  };

  return showSuccessToast;
};
