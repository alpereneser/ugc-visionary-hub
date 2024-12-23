import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CurrencySelect } from "./CurrencySelect";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  sku: z.string().optional(),
  cost_price: z.string().optional(),
  cost_price_currency: z.string().default("USD"),
  retail_price: z.string().optional(),
  retail_price_currency: z.string().default("USD"),
  url: z.string().url().optional().or(z.literal("")),
});

export const ProductForm = () => {
  const navigate = useNavigate();
  const session = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      cost_price: "",
      cost_price_currency: "USD",
      retail_price: "",
      retail_price_currency: "USD",
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("products")
        .insert([
          {
            ...values,
            cost_price: values.cost_price ? parseFloat(values.cost_price) : null,
            retail_price: values.retail_price ? parseFloat(values.retail_price) : null,
            created_by: session?.user?.id,
          },
        ]);

      if (error) throw error;

      toast.success("Product added successfully");
      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <CurrencySelect
                    value={form.watch("cost_price_currency")}
                    onChange={(value) => form.setValue("cost_price_currency", value)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retail_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retail Price</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <CurrencySelect
                    value={form.watch("retail_price_currency")}
                    onChange={(value) => form.setValue("retail_price_currency", value)}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </Form>
  );
};