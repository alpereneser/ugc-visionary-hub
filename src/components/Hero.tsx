import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ReviewsGrid } from "./reviews/ReviewsGrid";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative isolate px-4 sm:px-6 pt-10 sm:pt-14 lg:px-8 bg-black text-white min-h-screen flex items-center">
      <div className="mx-auto max-w-6xl py-16 sm:py-32 lg:py-40">
        <div className="text-center">
          <h1 
            className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight font-['Montserrat'] cursor-pointer hover:opacity-80 transition-opacity bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text px-2"
            onClick={() => navigate('/home')}
          >
            TRACEFLUENCE
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl leading-8 text-gray-300 px-4">
            The Ultimate Platform for Managing UGC Campaigns
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-base sm:text-lg px-6 sm:px-8">
                Register and Start Tracking
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 bg-purple-500 hover:bg-purple-600 border-purple-500 hover:border-purple-600">
                Login
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 sm:mt-12">
            <ReviewsGrid />
          </div>
        </div>
      </div>
    </div>
  );
};