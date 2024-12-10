export const Pricing = () => {
  return (
    <div className="py-20 px-4 bg-accent">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple Pricing</h2>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-5xl font-bold text-primary mb-4">$50</div>
          <div className="text-xl font-semibold mb-6">Lifetime Access</div>
          <ul className="text-secondary space-y-4 mb-8">
            <li>✓ Unlimited Campaign Tracking</li>
            <li>✓ Performance Analytics</li>
            <li>✓ Future Planning Tools</li>
            <li>✓ Free Lifetime Updates</li>
          </ul>
          <button className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors w-full">
            Get Lifetime Access
          </button>
        </div>
      </div>
    </div>
  );
};