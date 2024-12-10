import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { CreatorSelector } from "./CreatorSelector";
import { ProductSelector } from "./ProductSelector";
import { MediaUploader } from "./MediaUploader";
import { CostBreakdown } from "./CostBreakdown";
import { ExpenseInput } from "./ExpenseInput";

const formSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  selectedCreators: z.array(z.string()).min(1, "Select at least one creator"),
  selectedProducts: z.array(z.string()).min(1, "Select at least one product"),
  media: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CampaignForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);
  const [expenses, setExpenses] = useState<Array<{ name: string; amount: string }>>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      selectedCreators: [],
      selectedProducts: [],
      media: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Upload media files first
      const mediaUrls = [];
      for (const file of uploadedMedia) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('campaign_media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('campaign_media')
          .getPublicUrl(fileName);
          
        mediaUrls.push({
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      }

      // Insert campaign with additional expenses
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          name: values.name,
          description: values.description,
          start_date: values.startDate || null,
          end_date: values.endDate || null,
          status: "draft",
          media: mediaUrls,
          additional_expenses: expenses,
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
      navigate(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
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

        <MediaUploader
          uploadedMedia={uploadedMedia}
          setUploadedMedia={setUploadedMedia}
        />

        <ExpenseInput expenses={expenses} setExpenses={setExpenses} />

        <CostBreakdown
          selectedProducts={selectedProducts}
          selectedCreators={selectedCreators}
          expenses={expenses}
        />

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
  );
};