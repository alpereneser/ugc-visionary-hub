import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
  selectedCreators: z.array(z.string()).min(1, "Select at least one creator"),
  selectedProducts: z.array(z.string()).min(1, "Select at least one product"),
});

type FormValues = z.infer<typeof formSchema>;

const NewCampaign = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const { data: creators } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ugc_creators")
        .select("id, first_name, last_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, cost_price");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
      selectedCreators: [],
      selectedProducts: [],
    },
  });

  const calculateTotalCost = () => {
    let total = 0;
    
    // Add product costs
    selectedProducts.forEach((productId) => {
      const product = products?.find((p) => p.id === productId);
      if (product?.cost_price) {
        total += Number(product.cost_price) * selectedCreators.length;
      }
    });

    // Add campaign budget if specified
    const budget = form.watch("budget");
    if (budget) {
      total += Number(budget);
    }

    return total.toFixed(2);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Insert campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          name: values.name,
          description: values.description,
          start_date: values.startDate || null,
          end_date: values.endDate || null,
          status: "draft",
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Insert campaign creators
      const creatorPromises = selectedCreators.map((creatorId) =>
        supabase.from("campaign_creators").insert({
          campaign_id: campaign.id,
          creator_id: creatorId,
        })
      );

      // Insert campaign products
      const productPromises = selectedProducts.map((productId) =>
        supabase.from("campaign_products").insert({
          campaign_id: campaign.id,
          product_id: productId,
        })
      );

      await Promise.all([...creatorPromises, ...productPromises]);

      toast.success("Campaign created successfully");
      navigate("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campaign name" {...field} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter campaign description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="selectedCreators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Creators</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const updatedCreators = selectedCreators.includes(value)
                            ? selectedCreators.filter((id) => id !== value)
                            : [...selectedCreators, value];
                          setSelectedCreators(updatedCreators);
                          field.onChange(updatedCreators);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select creators" />
                        </SelectTrigger>
                        <SelectContent>
                          {creators?.map((creator) => (
                            <SelectItem key={creator.id} value={creator.id}>
                              {creator.first_name} {creator.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCreators.map((creatorId) => {
                        const creator = creators?.find((c) => c.id === creatorId);
                        return (
                          <div
                            key={creatorId}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                          >
                            {creator?.first_name} {creator?.last_name}
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            <SelectItem key={product.id} value={product.id}>
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
                            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
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

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Budget (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter additional budget"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Products Cost:</span>
                      <span>
                        $
                        {selectedProducts
                          .reduce((acc, productId) => {
                            const product = products?.find(
                              (p) => p.id === productId
                            );
                            return (
                              acc +
                              (product?.cost_price || 0) *
                                selectedCreators.length
                            );
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Budget:</span>
                      <span>${form.watch("budget") || "0.00"}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Estimated Cost:</span>
                      <span>${calculateTotalCost()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default NewCampaign;