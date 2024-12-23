import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const ProductSelector = ({ form, selectedProducts, setSelectedProducts }) => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("products")
        .select("id, name, cost_price, cost_price_currency")
        .eq('created_by', user?.id);
        
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="selectedProducts"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Products</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                const updatedProducts = selectedProducts.includes(value)
                  ? selectedProducts.filter((id) => id !== value)
                  : [...selectedProducts, value];
                setSelectedProducts(updatedProducts);
                field.onChange(updatedProducts);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select products" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem 
                    key={product.id} 
                    value={product.id}
                  >
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedProducts.map((productId) => {
              const product = products?.find((p) => p.id === productId);
              return (
                <div
                  key={productId}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-2"
                >
                  {product?.name}
                </div>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};