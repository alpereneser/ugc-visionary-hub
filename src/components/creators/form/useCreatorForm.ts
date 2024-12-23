import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { creatorFormSchema, type CreatorFormValues } from "@/types/creator-types";

export const useCreatorForm = () => {
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

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};