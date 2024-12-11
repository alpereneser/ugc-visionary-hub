import { MainLayout } from "@/components/layouts/MainLayout";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent successfully!");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground">info@tracefluence.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-muted-foreground">
                  123 Innovation Street<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input placeholder="Full Name" required />
            </div>
            <div>
              <Input type="email" placeholder="Email Address" required />
            </div>
            <div>
              <Textarea 
                placeholder="Your Message" 
                className="min-h-[150px]" 
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;