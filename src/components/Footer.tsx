import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-2 text-xl font-['Montserrat']">
            <span>We make</span>
            <Heart className="text-red-500 animate-pulse" size={24} />
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} UGC Tracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};