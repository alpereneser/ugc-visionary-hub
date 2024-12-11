import { MainLayout } from "@/components/layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    cost_price: "",
    retail_price: "",
    url: "",
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || "",
        description: data.description || "",
        sku: data.sku || "",
        cost_price: data.cost_price?.toString() || "",
        retail_price: data.retail_price?.toString() || "",
        url: data.url || "",
      });

      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          sku: formData.sku,
          cost_price: parseFloat(formData.cost_price) || 0,
          retail_price: parseFloat(formData.retail_price) || 0,
          url: formData.url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Product updated successfully");
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sku" className="text-sm font-medium">
                SKU
              </label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cost_price" className="text-sm font-medium">
                Cost Price
              </label>
              <Input
                id="cost_price"
                name="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="retail_price" className="text-sm font-medium">
                Retail Price
              </label>
              <Input
                id="retail_price"
                name="retail_price"
                type="number"
                step="0.01"
                value={formData.retail_price}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Product URL
              </label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProduct;
