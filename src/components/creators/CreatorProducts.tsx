import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  id: string;
  quantity: number;
  given_date: string;
  notes?: string;
  products?: {
    id: string;
    name: string;
    sku: string;
  };
  campaigns?: {
    id: string;
    name: string;
  };
}

interface CreatorProductsProps {
  products?: Product[];
}

export const CreatorProducts = ({ products }: CreatorProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Received</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {products?.map((product) => (
            <div key={product.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{product.products?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {product.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Given on: {new Date(product.given_date).toLocaleDateString()}
                  </p>
                  {product.campaigns?.name && (
                    <p className="text-sm text-muted-foreground">
                      Campaign: {product.campaigns.name}
                    </p>
                  )}
                </div>
              </div>
              {product.notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Notes: {product.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};