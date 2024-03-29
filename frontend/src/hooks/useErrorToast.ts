import { useToast } from "@/components/ui/use-toast";

export const useErrorToast = () => {
  const { toast } = useToast();

  const showErrorToast = (title: string, description: string) => {
    toast({
      variant: "destructive",
      title: title + " Error",
      description,
    });
  };

  return showErrorToast;
};
