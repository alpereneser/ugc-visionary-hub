import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-black text-white min-h-screen flex items-center">
      <div className="mx-auto max-w-6xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 
            className="text-6xl sm:text-8xl font-bold tracking-tight font-['Montserrat'] cursor-pointer hover:opacity-80 transition-opacity bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
            onClick={() => navigate('/home')}
          >
            TRACEFLUENCE
          </h1>
          <p className="mt-6 text-xl sm:text-2xl leading-8 text-gray-300">
            The Ultimate Platform for Managing UGC Campaigns
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-lg px-8">
                Start Tracking
              </Button>
            </Link>
            <Link to="/login" className="text-lg font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Login <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};