/**
 * Marka tescil sürecinin aşamaları ve süreleri — elle tutulan tablo.
 *
 * ─── BU TABLO DİĞER TARİFE TABLOLARINDAN FARKLI ───────────────────────
 * `harc-tarifeleri.ts` ve `kurulus-tarifeleri.ts` mevzuatta yazılı
 * rakamları tutuyor. Burada tutulan şey mevzuatta YAZMIYOR: TÜRKPATENT'in
 * fiilî işlem süreleri. Hiçbir kanun "şekli inceleme üç ay sürer"
 * demiyor; bu süreler kurumun iş yüküne göre değişiyor.
 *
 * Tek istisna, dizideki 2 aylık yayıma itiraz süresi — o kanunda yazılı
 * (SMK m. 18/1) ve `kesin: true` ile işaretli.
 *
 * ─── SÜRELER NEDEN ARALIK VE NEDEN BU KADAR GENİŞ ─────────────────────
 * Üç kaynağın aşama süreleri birbirini tutmuyor (docs § 8.1). Birini
 * seçip diğerlerini yok saymak, olmayan bir kesinlik iddia etmek olurdu.
 * Bunun yerine her aşamada kaynakların EN DÜŞÜK mini ve EN YÜKSEK maxı
 * alındı — "zarf yöntemi", Av. Onur Can Yılmaz tarafından onaylandı.
 *
 * Bedeli: toplam (4-13 ay), kaynakların kendi toplamlarından (6-10,
 * 6-8 ay) geniş çıkıyor, çünkü her aşamanın en kötü hâlini üst üste
 * toplamak hiçbir dosyada gerçekleşmeyecek bir üst sınır üretir. Dar ve
 * yanlış yerine geniş ve dürüst tercih edildi.
 *
 * ─── DAHA İYİ BİR KAYNAK ÇIKARSA ──────────────────────────────────────
 * TÜRKPATENT'in kendi hizmet standartları tablosuna ulaşılamadı (docs
 * § 8.9). Tablo elde edilirse aşama süreleri doğrudan ona bağlanır ve
 * ikincil kaynaklar dayanak olmaktan çıkar — değişecek tek yer burası.
 *
 * Gerekçe ve kaynaklar: docs/hesaplama-formulleri.md § 8.
 */
import type { LegalReference } from './calculator-ui';

/**
 * Süre birimi. Hafta ve ay ayrı tutuluyor çünkü ay ekleme takvimsel:
 * "1 ay" 30 gün değil, ayın karşılık gelen günü (docs § 8.5).
 */
export type SureBirimi = 'hafta' | 'ay';

export interface Sure {
  deger: number;
  birim: SureBirimi;
}

export interface Asama {
  /** Zaman çizelgesinde görünen başlık. */
  ad: string;
  /** Aşamada ne olduğunu anlatan tek cümle. */
  aciklama: string;
  min: Sure;
  max: Sure;
  /**
   * Süre kanunda yazılıysa `true`. Yalnızca yayıma itiraz süresi böyle;
   * arayüz bu aşamayı görsel olarak ayırıyor çünkü diğerleri tahmin,
   * bu değil.
   */
  kesin?: boolean;
  dayanak: LegalReference;
}

const D = {
  sekli: {
    short: 'SMK m.15',
    full: '6769 sayılı Sınai Mülkiyet Kanunu m. 15 — Başvurunun şeklî yönden incelenmesi ve eksikliklerin giderilmesi',
  },
  esas: {
    short: 'SMK m.16',
    full: '6769 sayılı Sınai Mülkiyet Kanunu m. 16 — Başvurunun mutlak ret nedenleri açısından incelenmesi ve Bültende yayımlanması',
  },
  itiraz: {
    short: 'SMK m.18/1',
    full: '6769 sayılı Sınai Mülkiyet Kanunu m. 18/1 — Yayıma itiraz: itirazlar, başvurunun yayımından itibaren iki ay içinde yapılır',
  },
  tescil: {
    short: 'SMK m.22',
    full: '6769 sayılı Sınai Mülkiyet Kanunu m. 22 — Markanın tescili ve sicile kaydı',
  },
} as const satisfies Record<string, LegalReference>;

/**
 * İtiraz gelmeyen başvurunun aşamaları, sırayla.
 *
 * Her aşama bir öncekinin bitişinde başlıyor; tarihler kümülatif
 * hesaplanıyor (min yol minleri, max yol maxları toplar).
 */
export const ASAMALAR: readonly Asama[] = [
  {
    ad: 'Başvuru ve şekli inceleme',
    aciklama: 'Kurum, başvurunun biçim şartlarını ve eksikliklerini inceler.',
    min: { deger: 2, birim: 'hafta' },
    max: { deger: 4, birim: 'ay' },
    dayanak: D.sekli,
  },
  {
    ad: 'Mutlak ret nedenleri incelemesi',
    aciklama: 'Ayırt edicilik gibi mutlak ret nedenleri yönünden inceleme yapılır.',
    min: { deger: 1, birim: 'ay' },
    max: { deger: 5, birim: 'ay' },
    dayanak: D.esas,
  },
  {
    ad: 'Bültende yayım ve itiraz süresi',
    aciklama: 'Başvuru Bültende yayımlanır; üçüncü kişiler bu süre içinde itiraz edebilir.',
    min: { deger: 2, birim: 'ay' },
    max: { deger: 2, birim: 'ay' },
    kesin: true,
    dayanak: D.itiraz,
  },
  {
    ad: 'Tescil ve belge düzenlenmesi',
    aciklama: 'İtiraz gelmemişse marka tescil edilerek sicile kaydedilir ve belge düzenlenir.',
    min: { deger: 2, birim: 'hafta' },
    max: { deger: 2, birim: 'ay' },
    dayanak: D.tescil,
  },
];

/**
 * İtiraz gelmesi hâlinde başvurudan tescile kadar geçen toplam süre.
 *
 * Aşamalara bölünmedi: itirazın incelenmesi, karara itiraz ve YİDK yolu
 * dosyaya göre çok değişiyor ve kaynaklarda aşama aşama süre verilmiyor.
 * Üç kaynak da toplam için bir aralık veriyor (10-18, 12-18, 12-24);
 * ortadaki 12-18 alındı (docs § 8.3).
 */
export const ITIRAZLI_SURE: { min: Sure; max: Sure } = {
  min: { deger: 12, birim: 'ay' },
  max: { deger: 18, birim: 'ay' },
};

/** İtirazlı dalın dayanağı — itiraz süresini veren madde. */
export const ITIRAZLI_DAYANAK: LegalReference = D.itiraz;

/**
 * 6769 sayılı Kanun'un yürürlük tarihi (RG 10.01.2017).
 *
 * Bu tarihten önceki başvurular 556 sayılı KHK rejimine tabiydi ve aşama
 * yapısı farklıydı; araç onlar için hesap yapmıyor.
 */
export const SMK_YURURLUK = Date.UTC(2017, 0, 10);
