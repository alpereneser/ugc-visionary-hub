import { MainLayout } from "@/components/layouts/MainLayout";

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 prose prose-slate max-w-4xl">
        <h1>Kullanım Koşulları</h1>
        
        <p>Son güncellenme: {new Date().toLocaleDateString('tr-TR')}</p>

        <h2>1. Hizmet Kullanımı</h2>
        <p>
          Tracefluence platformunu kullanarak, bu kullanım koşullarını kabul etmiş 
          olursunuz. Platformu yalnızca yasal amaçlar için ve bu koşullara uygun 
          olarak kullanmayı kabul edersiniz.
        </p>

        <h2>2. Hesap Güvenliği</h2>
        <p>
          Hesabınızın güvenliğinden siz sorumlusunuz. Hesap bilgilerinizi güvende 
          tutmalı ve başkalarıyla paylaşmamalısınız.
        </p>

        <h2>3. Ödeme ve Abonelikler</h2>
        <p>
          Ücretli hizmetlerimiz için yapılan ödemeler iade edilmez. Abonelikler 
          otomatik olarak yenilenir ve istediğiniz zaman iptal edilebilir.
        </p>

        <h2>4. Fikri Mülkiyet</h2>
        <p>
          Platform üzerindeki tüm içerik ve materyaller Tracefluence'in mülkiyetindedir 
          ve telif hakkı yasaları ile korunmaktadır.
        </p>

        <h2>5. Sorumluluk Reddi</h2>
        <p>
          Hizmetlerimiz "olduğu gibi" sunulmaktadır. Platform kullanımından 
          doğabilecek herhangi bir zarar için sorumluluk kabul etmemekteyiz.
        </p>

        <h2>6. İletişim</h2>
        <p>
          Bu kullanım koşulları hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
          <br />
          Email: legal@tracefluence.com
        </p>
      </div>
    </MainLayout>
  );
};

export default Terms;