import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const MainLayout = ({ children, showHeader = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};