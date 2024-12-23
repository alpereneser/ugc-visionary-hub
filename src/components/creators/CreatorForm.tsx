import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { SocialMediaFields } from "./form/SocialMediaFields";
import { useCreatorForm } from "./form/useCreatorForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export const CreatorForm = () => {
  const { form, onSubmit, isSubmitting } = useCreatorForm();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      toast.error("Please login to create a creator");
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <SocialMediaFields form={form} />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Creator"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatorForm;