import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const { isLoading } = useQuery({
    queryKey: ["creator", id],
    queryFn: async () => {
      const { data: creator, error } = await supabase
        .from("ugc_creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setFormData({
        first_name: creator.first_name,
        last_name: creator.last_name,
        email: creator.email || "",
        phone: creator.phone || "",
      });
      
      return creator;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("ugc_creators")
        .update(formData)
        .eq("id", id);

      if (error) throw error;

      toast.success("İçerik üreticisi başarıyla güncellendi");
      navigate(`/creators/${id}`);
    } catch (error) {
      console.error("Error updating creator:", error);
      toast.error("İçerik üreticisi güncellenirken bir hata oluştu");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">İçerik Üreticisi Düzenle</h1>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Ad</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Soyad</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    İptal
                  </Button>
                  <Button type="submit">Kaydet</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditCreator;