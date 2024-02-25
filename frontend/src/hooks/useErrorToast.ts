import { useToast } from "@/components/ui/use-toast";

export const useErrorToast = () => {
  const { toast } = useToast();

  const showErrorToast = (title: string, desc: string) => {
    toast({
      variant: "destructive",
      title: title + " Error",
      description: desc,
    });
  };

  return showErrorToast;
};
