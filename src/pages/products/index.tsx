import { Header } from "@/components/Header";
import { ProductsList } from "@/components/products/ProductsList";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ProductsList />
      </main>
    </div>
  );
};

export default ProductsPage;