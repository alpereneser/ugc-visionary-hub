import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CurrencySelect } from "./CurrencySelect";

interface ProductFormData {
  name: string;
  description?: string;
  sku?: string;
  cost_price?: string;
  cost_price_currency: string;
  retail_price?: string;
  retail_price_currency: string;
  url?: string;
}

export const ProductForm = () => {
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    sku: "",
    cost_price: "",
    cost_price_currency: "USD",
    retail_price: "",
    retail_price_currency: "USD",
    url: "",
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { error } = await supabase
        .from("products")
        .insert([
          {
            name: data.name,
            description: data.description,
            sku: data.sku,
            cost_price: data.cost_price ? parseFloat(data.cost_price) : null,
            cost_price_currency: data.cost_price_currency,
            retail_price: data.retail_price ? parseFloat(data.retail_price) : null,
            retail_price_currency: data.retail_price_currency,
            url: data.url,
            created_by: session?.user?.id,
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      setFormData({
        name: "",
        description: "",
        sku: "",
        cost_price: "",
        cost_price_currency: "USD",
        retail_price: "",
        retail_price_currency: "USD",
        url: "",
      });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await createProductMutation.mutateAsync(formData);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
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
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};