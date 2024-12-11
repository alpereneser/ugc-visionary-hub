import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>We Make Passion</span>
            <Heart className="text-red-500 animate-pulse w-4 h-4" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
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
          
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} UGC Tracker
          </div>
        </div>
      </div>
    </footer>
  );
};