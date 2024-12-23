import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { CreatorFormValues } from "@/types/creator-types";

interface SocialMediaFieldsProps {
  form: UseFormReturn<CreatorFormValues>;
}

export const SocialMediaFields = ({ form }: SocialMediaFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Social Media Profiles</h3>
      <FormField
        control={form.control}
        name="instagram_username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram Username</FormLabel>
            <FormControl>
              <Input placeholder="username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tiktok_username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TikTok Username</FormLabel>
            <FormControl>
              <Input placeholder="username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="youtube_username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>YouTube Username</FormLabel>
            <FormControl>
              <Input placeholder="username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};