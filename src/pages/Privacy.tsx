import { MainLayout } from "@/components/layouts/MainLayout";

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 prose prose-slate max-w-4xl">
        <h1>Privacy Policy</h1>
        
        <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
        
        <h2>1. Information Collection</h2>
        <p>
          At Tracefluence, we collect certain personal information while you use our services. 
          This information may include:
        </p>
        <ul>
          <li>Your name and surname</li>
          <li>Your email address</li>
          <li>Company information</li>
          <li>Payment information</li>
        </ul>

        <h2>2. Use of Information</h2>
        <p>
          We use the collected information for the following purposes:
        </p>
        <ul>
          <li>To provide and improve our services</li>
          <li>To manage your account</li>
          <li>To provide support</li>
          <li>To fulfill our legal obligations</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We use industry-standard security measures to protect your personal data. 
          Your data is encrypted and regularly backed up.
        </p>

        <h2>4. Contact</h2>
        <p>
          If you have any questions about this privacy policy, please contact us:
          <br />
          Email: privacy@tracefluence.com
        </p>
      </div>
    </MainLayout>
  );
};

export default Privacy;