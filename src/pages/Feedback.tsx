import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

const Feedback = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-2xl py-10">
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
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;