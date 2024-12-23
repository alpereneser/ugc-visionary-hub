import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatorSelector } from "../CreatorSelector";
import { ProductSelector } from "../ProductSelector";
import { ExpenseInput } from "../ExpenseInput";
import { CostBreakdown } from "../CostBreakdown";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "upcoming"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  selectedCreators: z.array(z.string()),
  selectedProducts: z.array(z.string()),
});

export type CampaignFormData = z.infer<typeof formSchema>;

interface CampaignFormFieldsProps {
  defaultValues: CampaignFormData;
  onSubmit: (values: CampaignFormData) => void;
  onCancel: () => void;
  initialExpenses?: Array<{ name: string; amount: string; currency: string }>;
}

export const CampaignFormFields = ({
  defaultValues,
  onSubmit,
  onCancel,
  initialExpenses = [],
}: CampaignFormFieldsProps) => {
  const [selectedCreators, setSelectedCreators] = useState<string[]>(
    defaultValues.selectedCreators || []
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultValues.selectedProducts || []
  );
  const [expenses, setExpenses] = useState(initialExpenses);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: CampaignFormData) => {
    onSubmit({
      ...values,
      selectedCreators,
      selectedProducts,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
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
            name="endDate"
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

        <ExpenseInput expenses={expenses} setExpenses={setExpenses} />

        <CostBreakdown
          selectedProducts={selectedProducts}
          selectedCreators={selectedCreators}
          expenses={expenses}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};