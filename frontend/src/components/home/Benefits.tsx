import { RefreshCcw, Shield, Truck } from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";

interface BenefitProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  textColor?: string;
}

const Benefit: React.FC<BenefitProps> = ({ title, description, icon, textColor }) => {
  return (
    <div className="flex md:flex-row flex-col xs:max-md:justify-center xs:max-md:items-center gap-2">
      {icon}
      <div className="flex flex-col xs:max-md:text-center">
        <strong className="text-lg">{title}</strong>
        <span className={textColor}>{description}</span>
      </div>
    </div>
  );
};

const benefitsData = [
  {
    title: "Free, next-day delivery",
    description: "No order minimum.",
    icon: <Truck className="size-12" />,
    textColor: "text-destructive",
  },
  {
    title: "Free, easy returns",
    description: "Hassle-free and no charge.",
    icon: <RefreshCcw className="size-12" />,
  },
  {
    title: "Price protection promise",
    description: "See a price drop in 14 days? We'll fix it.",
    icon: <Shield className="size-12" />,
  },
];

const Benefits: React.FC = () => {
  return (
    <div className="flex md:flex-row flex-col md:justify-evenly justify-center md:h-14 xs:max-md:bg-accent-foreground/5 rounded-xl xs:max-md:p-4 xs:max-md:items-center xs:max-md:gap-4">
      {benefitsData.map((benefit, index) => (
        <React.Fragment key={index}>
          <Benefit {...benefit} />
          {index !== benefitsData.length - 1 && <Separator orientation="vertical" className="md:block hidden" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Benefits;
