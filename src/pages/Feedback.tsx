import { MainLayout } from "@/components/layouts/MainLayout";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

const Feedback = () => {
  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto py-16">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
            <p className="text-muted-foreground">
              Help us improve UGC Tracker by sharing your feedback.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Feedback;