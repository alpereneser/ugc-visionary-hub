import { MainLayout } from "@/components/layouts/MainLayout";
import { CreatorForm } from "@/components/creators/CreatorForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthWrapper } from "@/components/AuthWrapper";

const NewCreator = () => {
  const navigate = useNavigate();

  return (
    <AuthWrapper>
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

            <CreatorForm />
          </div>
        </div>
      </MainLayout>
    </AuthWrapper>
  );
};

export default NewCreator;