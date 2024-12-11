import { MainLayout } from "@/components/layouts/MainLayout";

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 prose prose-slate max-w-4xl">
        <h1>Gizlilik Politikası</h1>
        
        <p>Son güncellenme: {new Date().toLocaleDateString('tr-TR')}</p>
        
        <h2>1. Bilgi Toplama</h2>
        <p>
          Tracefluence olarak, hizmetlerimizi kullanırken sizden bazı kişisel bilgiler topluyoruz. 
          Bu bilgiler şunları içerebilir:
        </p>
        <ul>
          <li>Ad ve soyadınız</li>
          <li>E-posta adresiniz</li>
          <li>Şirket bilgileriniz</li>
          <li>Ödeme bilgileriniz</li>
        </ul>

        <h2>2. Bilgilerin Kullanımı</h2>
        <p>
          Topladığımız bilgileri aşağıdaki amaçlar için kullanıyoruz:
        </p>
        <ul>
          <li>Hizmetlerimizi sağlamak ve iyileştirmek</li>
          <li>Hesabınızı yönetmek</li>
          <li>Size destek sağlamak</li>
          <li>Yasal yükümlülüklerimizi yerine getirmek</li>
        </ul>

        <h2>3. Bilgi Güvenliği</h2>
        <p>
          Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik 
          önlemleri kullanıyoruz. Verileriniz şifrelenerek saklanır ve düzenli olarak 
          yedeklenir.
        </p>

        <h2>4. İletişim</h2>
        <p>
          Bu gizlilik politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
          <br />
          Email: privacy@tracefluence.com
        </p>
      </div>
    </MainLayout>
  );
};

export default Privacy;