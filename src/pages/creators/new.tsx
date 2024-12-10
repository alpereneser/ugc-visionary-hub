import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Header } from "@/components/Header";
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
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const socialMediaPlatforms = [
  "Instagram",
  "TikTok",
  "Facebook",
  "Snapchat",
  "Other",
] as const;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  socialMediaProfiles: z.array(z.object({
    platform: z.enum(socialMediaPlatforms),
    username: z.string().min(1, "Username is required"),
    url: z.string().url("Invalid URL").optional().nullable(),
    followersCount: z.number().min(0).optional().nullable(),
  })),
});

type FormValues = z.infer<typeof formSchema>;

const NewCreator = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      socialMediaProfiles: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Insert creator
      const { data: creatorData, error: creatorError } = await supabase
        .from("ugc_creators")
        .insert({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
        })
        .select()
        .single();

      if (creatorError) throw creatorError;

      // Insert social media profiles
      if (values.socialMediaProfiles.length > 0) {
        const { error: profilesError } = await supabase
          .from("social_media_profiles")
          .insert(
            values.socialMediaProfiles.map((profile) => ({
              creator_id: creatorData.id,
              platform: profile.platform.toLowerCase(),
              username: profile.username,
              url: profile.url,
              followers_count: profile.followersCount,
            }))
          );

        if (profilesError) throw profilesError;
      }

      toast.success("Creator added successfully");
      navigate("/creators");
    } catch (error) {
      console.error("Error adding creator:", error);
      toast.error("Failed to add creator");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSocialMediaProfile = () => {
    const currentProfiles = form.getValues("socialMediaProfiles");
    form.setValue("socialMediaProfiles", [
      ...currentProfiles,
      { platform: "Instagram", username: "", url: "", followersCount: null },
    ]);
  };

  const removeSocialMediaProfile = (index: number) => {
    const currentProfiles = form.getValues("socialMediaProfiles");
    form.setValue(
      "socialMediaProfiles",
      currentProfiles.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Add New Creator</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} />
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
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Social Media Profiles</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSocialMediaProfile}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Profile
                  </Button>
                </div>

                {form.watch("socialMediaProfiles").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Profile {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialMediaProfile(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`socialMediaProfiles.${index}.platform`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                {socialMediaPlatforms.map((platform) => (
                                  <option key={platform} value={platform}>
                                    {platform}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`socialMediaProfiles.${index}.username`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`socialMediaProfiles.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter profile URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`socialMediaProfiles.${index}.followersCount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Followers Count (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter followers count"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value ? parseInt(value) : null);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Creator"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default NewCreator;