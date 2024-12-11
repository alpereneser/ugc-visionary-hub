import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 
            className="text-4xl font-bold tracking-tight sm:text-6xl font-['Montserrat'] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/home')}
          >
            TRACEFLUENCE
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Trace the Influence, Amplify Your Impact
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6">
              Login <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};