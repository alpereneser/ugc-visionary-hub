import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const placeholderImages = [
  "photo-1649972904349-6e44c42644a7",
  "photo-1488590528505-98d2b5aba04b",
  "photo-1518770660439-4636190af475",
  "photo-1461749280684-dccba630e2f6",
  "photo-1486312338219-ce68d2c6f44d",
  "photo-1581091226825-a6a2a5aee158",
];

const slides = [
  {
    title: "Connect with Top Influencers",
    description: "Build authentic relationships and amplify your brand's reach"
  },
  {
    title: "Track Your Impact",
    description: "Measure and optimize your influencer campaigns in real-time"
  },
  {
    title: "Maximize ROI",
    description: "Turn influence into measurable results with our advanced analytics"
  }
];

export const HeroSlider = () => {
  return (
    <div className="w-full bg-black text-white py-20">
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
                <div className="relative flex flex-col items-center p-6">
                  <div className="relative w-full max-w-2xl mx-auto mb-8">
                    <div className="aspect-[16/9] relative overflow-hidden rounded-xl">
                      <img
                        src={`https://images.unsplash.com/${placeholderImages[index]}`}
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
                </div>
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