import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { SocialMediaFields } from "./form/SocialMediaFields";
import { useCreatorForm } from "./form/useCreatorForm";

export const CreatorForm = () => {
  const { form, onSubmit, isSubmitting } = useCreatorForm();

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