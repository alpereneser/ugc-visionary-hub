import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { CurrencySelect } from "@/components/products/CurrencySelect";

const NewProduct = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    cost_price: "",
    cost_price_currency: "USD",
    retail_price: "",
    retail_price_currency: "USD",
    url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            sku: formData.sku,
            cost_price: parseFloat(formData.cost_price) || null,
            cost_price_currency: formData.cost_price_currency,
            retail_price: parseFloat(formData.retail_price) || null,
            retail_price_currency: formData.retail_price_currency,
            url: formData.url,
            created_by: session?.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Product created successfully");
      navigate(`/products/${data.id}`);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter product SKU"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price</Label>
              <div className="flex gap-4">
                <Input
                  id="cost_price"
                  name="cost_price"
                  type="number"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={handleChange}
                  placeholder="Enter cost price"
                  className="flex-1"
                />
                <CurrencySelect
                  value={formData.cost_price_currency}
                  onChange={handleCurrencyChange("cost_price_currency")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retail_price">Retail Price</Label>
              <div className="flex gap-4">
                <Input
                  id="retail_price"
                  name="retail_price"
                  type="number"
                  step="0.01"
                  value={formData.retail_price}
                  onChange={handleChange}
                  placeholder="Enter retail price"
                  className="flex-1"
                />
                <CurrencySelect
                  value={formData.retail_price_currency}
                  onChange={handleCurrencyChange("retail_price_currency")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Product URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Enter product URL"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProduct;