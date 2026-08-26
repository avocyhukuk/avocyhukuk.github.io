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
  {
    slug: 'arac-deger-kaybi',
    title: 'Araç Değer Kaybı Hesaplama',
    summary: 'Kazaya karışan aracın onarım sonrası piyasa değerindeki azalmayı tahmin eder.',
    areas: ['sigorta-hukuku'],
    status: 'planned',
  },
  {
    slug: 'kira-artis-orani',
    title: 'Kira Artış Oranı Hesaplama',
    summary:
      'Yenilenen kira döneminde uygulanabilecek azami artış oranını TÜFE on iki aylık ortalamasına göre hesaplar.',
    areas: ['gayrimenkul-hukuku'],
    status: 'planned',
  },
  {
    slug: 'icra-gecikme-faizi',
    title: 'İcra / Gecikme Faizi Hesaplama',
    summary: 'Takip tarihinden ödeme tarihine kadar işleyen faizi ve toplam borcu hesaplar.',
    areas: ['icra-iflas-hukuku'],
    status: 'planned',
  },
  {
    slug: 'arac-mahrumiyet-bedeli',
    title: 'Araç Mahrumiyet Bedeli Hesaplama',
    summary: 'Aracın onarımda geçirdiği süre boyunca kullanılamamasından doğan zararı tahmin eder.',
    areas: ['sigorta-hukuku'],
    status: 'planned',
  },
  {
    slug: 'harc-ve-masraf',
    title: 'Dava / İcra Harç ve Masraf Hesaplama',
    summary: 'Dava veya icra takibi açarken ödenecek harç ve masrafların tahmini tutarını verir.',
    areas: ['icra-iflas-hukuku'],
    status: 'planned',
  },
  {
    slug: 'sirket-kurulus-maliyeti',
    title: 'Şirket Kuruluş Maliyeti Hesaplama',
    summary:
      'Limited veya anonim şirket kuruluşunda ortaya çıkan harç, noter ve tescil giderlerini toplar.',
    areas: ['startup-girisim-hukuku', 'ticaret-sirketler-hukuku'],
    status: 'planned',
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
