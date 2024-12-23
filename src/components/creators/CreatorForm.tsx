import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { creatorFormSchema, type CreatorFormValues } from "@/types/creator-types";

export const CreatorForm = () => {
  const navigate = useNavigate();
  const session = useSession();

  const form = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      instagram_username: "",
      tiktok_username: "",
      youtube_username: "",
    },
  });

  const onSubmit = async (values: CreatorFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a creator");
      return;
    }

    try {
      // First, create the creator
      const { data: creator, error: creatorError } = await supabase
        .from("ugc_creators")
        .insert({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (creatorError) throw creatorError;

      // Then, create social media profiles
      const socialMediaProfiles = [];
      if (values.instagram_username) {
        socialMediaProfiles.push({
          creator_id: creator.id,
          platform: "instagram",
          username: values.instagram_username,
          url: `https://instagram.com/${values.instagram_username}`,
        });
      }
      if (values.tiktok_username) {
        socialMediaProfiles.push({
          creator_id: creator.id,
          platform: "tiktok",
          username: values.tiktok_username,
          url: `https://tiktok.com/@${values.tiktok_username}`,
        });
      }
      if (values.youtube_username) {
        socialMediaProfiles.push({
          creator_id: creator.id,
          platform: "youtube",
          username: values.youtube_username,
          url: `https://youtube.com/@${values.youtube_username}`,
        });
      }

      if (socialMediaProfiles.length > 0) {
        const { error: socialError } = await supabase
          .from("social_media_profiles")
          .insert(socialMediaProfiles);

        if (socialError) throw socialError;
      }

      toast.success("Creator created successfully");
      navigate("/creators");
    } catch (error) {
      console.error("Error creating creator:", error);
      toast.error("Failed to create creator");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder="+1 234 567 8900" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Creator"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatorForm;