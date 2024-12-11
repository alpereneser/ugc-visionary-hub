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
import { Textarea } from "@/components/ui/textarea";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    url: "",
    retail_price: "",
    cost_price: "",
  });

  const { isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setFormData({
        name: product.name,
        description: product.description || "",
        sku: product.sku || "",
        url: product.url || "",
        retail_price: product.retail_price?.toString() || "",
        cost_price: product.cost_price?.toString() || "",
      });
      
      return product;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("products")
        .update({
          ...formData,
          retail_price: formData.retail_price ? Number(formData.retail_price) : null,
          cost_price: formData.cost_price ? Number(formData.cost_price) : null,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Ürün başarıyla güncellendi");
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Ürün güncellenirken bir hata oluştu");
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
            <h1 className="text-3xl font-bold">Ürün Düzenle</h1>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ürün Adı</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Ürün URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="retail_price">Satış Fiyatı</Label>
                    <Input
                      id="retail_price"
                      type="number"
                      step="0.01"
                      value={formData.retail_price}
                      onChange={(e) =>
                        setFormData({ ...formData, retail_price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost_price">Maliyet Fiyatı</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) =>
                        setFormData({ ...formData, cost_price: e.target.value })
                      }
                    />
                  </div>
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

export default EditProduct;