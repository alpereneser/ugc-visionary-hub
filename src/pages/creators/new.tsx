import { MainLayout } from "@/components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const creatorFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  instagram_username: z.string().optional(),
  tiktok_username: z.string().optional(),
  youtube_username: z.string().optional(),
});

type CreatorFormValues = z.infer<typeof creatorFormSchema>;

const NewCreator = () => {
  const navigate = useNavigate();
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

  const createCreator = useMutation({
    mutationFn: async (values: CreatorFormValues) => {
      // First, create the creator
      const { data: creator, error: creatorError } = await supabase
        .from("ugc_creators")
        .insert([{
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
        }])
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

      return creator;
    },
    onSuccess: () => {
      toast.success("Creator created successfully");
      navigate("/creators");
    },
    onError: (error) => {
      console.error("Error creating creator:", error);
      toast.error("Failed to create creator");
    },
  });

  const onSubmit = (values: CreatorFormValues) => {
    createCreator.mutate(values);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">New Creator</h1>
          </div>

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
                  disabled={createCreator.isPending}
                >
                  {createCreator.isPending ? "Creating..." : "Create Creator"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewCreator;