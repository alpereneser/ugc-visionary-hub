import { MainLayout } from "@/components/layouts/MainLayout";

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 prose prose-slate max-w-4xl">
        <h1>Terms of Service</h1>
        
        <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

        <h2>1. Service Usage</h2>
        <p>
          By using the Tracefluence platform, you agree to these terms of service. 
          You agree to use the platform only for legal purposes and in accordance 
          with these terms.
        </p>

        <h2>2. Account Security</h2>
        <p>
          You are responsible for maintaining the security of your account. 
          Keep your account information secure and do not share it with others.
        </p>

        <h2>3. Payments and Subscriptions</h2>
        <p>
          Payments for our paid services are non-refundable. Subscriptions 
          automatically renew and can be cancelled at any time.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content and materials on the platform are owned by Tracefluence 
          and are protected by copyright laws.
        </p>

        <h2>5. Disclaimer</h2>
        <p>
          Our services are provided "as is". We do not accept liability for 
          any damages that may arise from using our platform.
        </p>

        <h2>6. Contact</h2>
        <p>
          If you have any questions about these terms, please contact us:
          <br />
          Email: legal@tracefluence.com
        </p>
      </div>
    </MainLayout>
  );
};

export default Terms;