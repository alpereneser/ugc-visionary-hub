import { ProductsList } from "@/components/products/ProductsList";
import { MainLayout } from "@/components/layouts/MainLayout";

const ProductsPage = () => {
  return (
    <MainLayout>
      <ProductsList />
    </MainLayout>
  );
};

export default ProductsPage;