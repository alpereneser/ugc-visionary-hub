import { MainLayout } from "@/components/layouts/MainLayout";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mesajınız başarıyla gönderildi!");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Bize Ulaşın</h1>
        
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
                <h3 className="font-semibold text-lg">Telefon</h3>
                <p className="text-muted-foreground">+90 (555) 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Adres</h3>
                <p className="text-muted-foreground">
                  Maslak Mah. Büyükdere Cad.<br />
                  No:255 Sarıyer/İstanbul
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input placeholder="Adınız Soyadınız" required />
            </div>
            <div>
              <Input type="email" placeholder="Email Adresiniz" required />
            </div>
            <div>
              <Textarea 
                placeholder="Mesajınız" 
                className="min-h-[150px]" 
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Gönder
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;