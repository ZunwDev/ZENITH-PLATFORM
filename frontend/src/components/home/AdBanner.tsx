import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const images = [
  "https://i.postimg.cc/QMLwsTfS/OIG2.jpg",
  "https://i.postimg.cc/pmX17DBB/OIG2-1-WOak.jpg",
  "https://i.postimg.cc/rDnYLKn2/OIG2-S9-FS9v-RG.jpg",
];

export default function AdBanner() {
  return (
    <Carousel
      className="w-full max-h-96"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}>
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index} className="rounded-lg">
            <div className="p-1">
              <Card>
                <CardContent className="flex h-96 items-center justify-center !p-0 rounded-lg">
                  <img src={img} className="object-fill block h-full w-full rounded-lg" loading="lazy" alt={"ad" + index} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
