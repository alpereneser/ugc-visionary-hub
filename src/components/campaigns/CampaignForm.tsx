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
import { CreatorSelector } from "./CreatorSelector";
import { ProductSelector } from "./ProductSelector";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  selectedCreators: z.array(z.string()),
  selectedProducts: z.array(z.string()),
});

export const CampaignForm = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      selectedCreators: [],
      selectedProducts: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Insert campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert([
          {
            name: values.name,
            description: values.description,
            start_date: values.start_date || null,
            end_date: values.end_date || null,
            created_by: session?.user?.id,
          },
        ])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Insert campaign creators
      if (selectedCreators.length > 0) {
        const { error: creatorsError } = await supabase
          .from("campaign_creators")
          .insert(
            selectedCreators.map((creatorId) => ({
              campaign_id: campaign.id,
              creator_id: creatorId,
            }))
          );

        if (creatorsError) throw creatorsError;
      }

      // Insert campaign products
      if (selectedProducts.length > 0) {
        const { error: productsError } = await supabase
          .from("campaign_products")
          .insert(
            selectedProducts.map((productId) => ({
              campaign_id: campaign.id,
              product_id: productId,
            }))
          );

        if (productsError) throw productsError;
      }

      toast.success("Campaign created successfully");
      navigate("/campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
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
              <FormLabel>Campaign Name</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CreatorSelector
          form={form}
          selectedCreators={selectedCreators}
          setSelectedCreators={setSelectedCreators}
        />

        <ProductSelector
          form={form}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">Create Campaign</Button>
        </div>
      </form>
    </Form>
  );
};