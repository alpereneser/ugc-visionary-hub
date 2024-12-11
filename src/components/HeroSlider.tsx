import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const slides = [
  {
    title: "Track Creator Performance",
    description: "Monitor and analyze creator metrics to optimize your UGC strategy",
    image: "photo-1649972904349-6e44c42644a7"
  },
  {
    title: "Manage Campaigns",
    description: "Streamline your UGC campaigns from planning to execution",
    image: "photo-1486312338219-ce68d2c6f44d"
  },
  {
    title: "Measure ROI",
    description: "Get detailed insights into your UGC investment returns",
    image: "photo-1581091226825-a6a2a5aee158"
  }
];

export const HeroSlider = () => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-900 to-black text-white py-24">
      <div className="container mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="md:basis-1/1">
                <Card className="relative flex flex-col items-center p-6 bg-white/5 backdrop-blur-lg border-none">
                  <div className="relative w-full max-w-2xl mx-auto mb-8">
                    <div className="aspect-[16/9] relative overflow-hidden rounded-xl">
                      <img
                        src={`https://images.unsplash.com/${slide.image}`}
                        alt={slide.title}
                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="text-center z-10 animate-fade-in">
                    <h2 className="text-4xl font-bold mb-4 font-['Montserrat']">{slide.title}</h2>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-white/10 hover:bg-white/20 border-none text-white" />
          <CarouselNext className="hidden md:flex -right-4 bg-white/10 hover:bg-white/20 border-none text-white" />
        </Carousel>
      </div>
    </div>
  );
};