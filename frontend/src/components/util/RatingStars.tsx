import { Star, StarHalf } from "lucide-react";

export default function RatingStars({ rating }) {
  const generateStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - Math.floor(rating);
    const emptyStars = 5 - fullStars - (halfStar >= 0.5 ? 1 : 0); // Adjust empty stars count based on half star

    let starArray = [];

    for (let i = 0; i < fullStars; i++) {
      starArray.push(<Star key={i} className="size-4 stroke-0 fill-yellow-500" />);
    }
    if (halfStar >= 0.5) {
      starArray.push(<StarHalf key="half" className="size-4 stroke-0 fill-yellow-500" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      starArray.push(<Star key={i + fullStars} className="size-4 stroke-1 stroke-muted-foreground/50 fill-muted" />);
    }

    return starArray;
  };

  return <span className="flex flex-row">{generateStars()}</span>;
}
