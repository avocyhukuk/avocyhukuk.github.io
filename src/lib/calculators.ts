/**
 * Hesaplama araçlarının tek doğruluk kaynağı — CLAUDE.md Bölüm 6.
 *
 * Buradaki sıra, Bölüm 6'daki öncelik sırasıdır ve Faz C'de bu sırayla
 * geliştirilecektir. Araçların kendisi henüz yok; bu liste hem hesaplama
 * araçları sayfasını hem de ilgili çalışma alanı sayfalarındaki bağlantıları
 * besler. Böylece bir araç yayına alındığında tek bir yerde `status`
 * değiştirilir, site genelinde tutarlı görünür.
 *
 * `areas`: aracın hangi çalışma alanı sayfalarında listeleneceği. Bir araç
 * birden fazla alana ait olabilir (ör. harç hesabı hem icra hem genel).
 */

export type CalculatorStatus = 'planned' | 'ready';

export interface Calculator {
  slug: string;
  title: string;
  summary: string;
  /** İlgili çalışma alanı slug'ları */
  areas: readonly string[];
  status: CalculatorStatus;
}

export const CALCULATORS: readonly Calculator[] = [
  {
    slug: 'infaz-hesaplama',
    title: 'İnfaz / Yatar Hesaplama',
    summary:
      'Verilen hapis cezasının koşullu salıverilme ve denetimli serbestlik süreleriyle birlikte tahmini infaz süresini hesaplar.',
    areas: ['ceza-hukuku'],
    status: 'planned',
  },
  /*
   * Araç Değer Kaybı burada DEĞİL — bilerek.
   *
   * CLAUDE.md Bölüm 6'nın 2 numaralı sırası bu araçtı. 12.06.2026 tarihli
   * Resmî Gazete değişikliği (Sayı 33278, MADDE 6), trafik sigortası genel
   * şartlarının değer kaybı hesabına ilişkin Ek-1'ini 1/7/2026'dan geçerli
   * olmak üzere tamamen yürürlükten kaldırdı. Yerine gelen A.5/a hükmü bir
   * formül değil, eksperin dikkate alacağı yedi unsur sayıyor.
   *
   * Hesaplanacak bir formül kalmadığı için araç yapılmadı; konu
   * /blog/arac-deger-kaybi-yeni-donem adresinde bilgilendirme yazısına
   * dönüştürüldü. Gerekçe ve birincil kaynaklar:
   * docs/hesaplama-formulleri.md § 2.
   */
  {
    slug: 'kira-artis-orani',
    title: 'Kira Artış Oranı Hesaplama',
    summary:
      'Yenilenen kira döneminde uygulanabilecek azami artış oranını TÜFE on iki aylık ortalamasına göre hesaplar.',
    areas: ['gayrimenkul-hukuku'],
    status: 'ready',
  },
  {
    slug: 'icra-gecikme-faizi',
    title: 'İcra / Gecikme Faizi Hesaplama',
    summary: 'Takip tarihinden ödeme tarihine kadar işleyen faizi ve toplam borcu hesaplar.',
    areas: ['icra-iflas-hukuku'],
    status: 'ready',
  },
  {
    slug: 'arac-mahrumiyet-bedeli',
    title: 'Araç Mahrumiyet Bedeli Hesaplama',
    summary: 'Aracın onarımda geçirdiği süre boyunca kullanılamamasından doğan zararı tahmin eder.',
    areas: ['sigorta-hukuku'],
    status: 'ready',
  },
  {
    slug: 'harc-ve-masraf',
    title: 'Dava / İcra Harç ve Masraf Hesaplama',
    summary: 'Dava veya icra takibi açarken ödenecek harç ve masrafların tahmini tutarını verir.',
    areas: ['icra-iflas-hukuku'],
    status: 'ready',
  },
  {
    slug: 'sirket-kurulus-maliyeti',
    title: 'Şirket Kuruluş Maliyeti Hesaplama',
    /*
     * Özet v1 kapsamını birebir yansıtıyor: yalnızca limited şirket ve
     * noter kalemi YOK — ana sözleşme 2018'den beri ticaret sicili
     * müdürlüğünde ücretsiz imzalanıyor (docs § 7.1). Önceki özet
     * "limited veya anonim ... noter" diyordu, ikisi de yanlıştı.
     */
    summary:
      'Limited şirket kuruluşunda ödenecek oda, tescil ve gazete giderleri ile Rekabet Kurumu payını toplar.',
    areas: ['startup-girisim-hukuku', 'ticaret-sirketler-hukuku'],
    status: 'ready',
  },
  {
    slug: 'marka-tescil-takvimi',
    title: 'Marka Tescil Süreç Takvimi',
    summary:
      'Marka başvurusundan tescile kadar geçen aşamaları ve yasal süreleri zaman çizelgesi olarak gösterir.',
    areas: ['fikri-mulkiyet-hukuku'],
    status: 'planned',
  },
] as const;

/** Belirli bir çalışma alanına ait araçları, Bölüm 6'daki sırayı koruyarak döndürür. */
export function calculatorsForArea(areaSlug: string): readonly Calculator[] {
  return CALCULATORS.filter((calculator) => calculator.areas.includes(areaSlug));
}

/** Yayına alınmış araç var mı — sayfaların boş durum metnini seçmesi için. */
export function hasReadyCalculators(): boolean {
  return CALCULATORS.some((calculator) => calculator.status === 'ready');
}
