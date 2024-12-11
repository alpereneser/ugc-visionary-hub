import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "UGC'nin Markanıza Sağlayacağı 5 Önemli Fayda",
    excerpt: "Kullanıcı tarafından oluşturulan içerik (UGC), markanızın otantik bir ses kazanmasına ve müşteri güvenini artırmasına yardımcı olur.",
    readTime: "5 dk",
    category: "UGC Stratejisi"
  },
  {
    id: 2,
    title: "Başarılı Bir UGC Kampanyası Nasıl Oluşturulur?",
    excerpt: "Etkili bir UGC kampanyası oluşturmak için adım adım rehber ve en iyi uygulamalar.",
    readTime: "7 dk",
    category: "Kampanya Yönetimi"
  },
  {
    id: 3,
    title: "UGC Creator'ları Seçerken Dikkat Edilmesi Gerekenler",
    excerpt: "Doğru UGC yaratıcılarını seçmek, kampanyanızın başarısı için kritik öneme sahiptir.",
    readTime: "6 dk",
    category: "Creator Seçimi"
  }
];

export const ArticlesSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Önerilen Yazılar</h2>
        <Button variant="ghost" className="text-primary">
          Tüm Yazılar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card 
            key={article.id}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200/50"
          >
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {article.readTime}
                </span>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {article.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};