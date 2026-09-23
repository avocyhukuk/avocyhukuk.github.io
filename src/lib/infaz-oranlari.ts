/**
 * Koşullu salıverilme oranları ve katalog suç listesi.
 *
 * Kaynak ve doğrulama durumu: docs/hesaplama-formulleri.md § 1.4, § 1.13/3.
 * Liste `mevzuat.gov.tr` konsolide metninden Av. Onur Can Yılmaz
 * tarafından doğrulandı (23.09.2026).
 *
 * ─── ÜÇ AYRI KAYNAKTAN ÜÇ AYRI ORAN ───────────────────────────────────
 * Oran tek bir tablodan gelmiyor; bu araçtaki en kolay hata burada:
 *
 *   1. **5275 m.107/2** — genel kural 1/2, katalog suçlar 2/3,
 *      nitelikli cinsel suçlar 3/4.
 *   2. **3713 m.17** — terör suçları 3/4. **m.107 tablosundan DEĞİL**;
 *      ayrı kanundan, ayrı dal. Kodda da ayrı dal.
 *   3. **5275 m.108** — mükerrirlik oranı. Katalog oranıyla çakışırsa
 *      YÜKSEK olan uygulanır (§ 1.4 sonu).
 *
 * ─── AÇIK MADDE: TCK 188 ──────────────────────────────────────────────
 * Uyuşturucu imal ve ticaretinin oranı ÇÖZÜLMEDİ (§ 1.13/4). Araç bu
 * kategoride oranı kendi seçmiyor; kullanıcıya sorup seçtiği oranı
 * uyguluyor. `uyusturucuOrani` girdisi bu yüzden var.
 */
import type { LegalReference } from './calculator-ui';

export interface Oran {
  pay: number;
  payda: number;
  /** Ekranda "1/2", "2/3" gibi gösterim. */
  metin: string;
  dayanak: LegalReference;
}

export const D = {
  genel: {
    short: '5275 m.107/2',
    full: '5275 sayılı Kanun m. 107/2 — Süreli hapis cezalarında koşullu salıverilme için cezanın yarısının infaz kurumunda çekilmesi',
  },
  katalog: {
    short: '5275 m.107/2',
    full: '5275 sayılı Kanun m. 107/2 — Katalog suçlarda cezanın üçte ikisinin infaz kurumunda çekilmesi',
  },
  nitelikliCinsel: {
    short: '5275 m.107/2',
    full: '5275 sayılı Kanun m. 107/2 — Nitelikli cinsel suçlarda cezanın dörtte üçünün infaz kurumunda çekilmesi',
  },
  teror: {
    short: '3713 m.17',
    full: '3713 sayılı Terörle Mücadele Kanunu m. 17 — Terör suçlarında koşullu salıverilme oranı',
  },
  mukerrir: {
    short: '5275 m.108',
    full: '5275 sayılı Kanun m. 108 — Mükerrirlere özgü infaz rejimi',
  },
  tavan: {
    short: '5275 m.108/2',
    full: '5275 sayılı Kanun m. 108/2 — Tekerrür nedeniyle eklenecek miktar, tekerrüre esas alınan cezanın en ağırından fazla olamaz',
  },
  mahsup: {
    short: 'TCK m.63',
    full: '5237 sayılı Türk Ceza Kanunu m. 63 — Gözaltında veya tutuklulukta geçen süre hükmolunan hapis cezasından indirilir',
  },
  uyusturucu: {
    short: 'TCK m.188',
    full: '5237 sayılı Türk Ceza Kanunu m. 188 — Uyuşturucu veya uyarıcı madde imal ve ticareti. Koşullu salıverilme oranı kullanıcı tarafından seçilir (bkz. uyarı)',
  },
} as const satisfies Record<string, LegalReference>;

/**
 * m.107/2 katalog suçları — 2/3 oranına tabi.
 *
 * § 1.13/3'te resmî metinle doğrulandı. İki düzeltme yapıldı:
 *   · TCK 302-325 listede **DEĞİL** (önceki notta vardı)
 *   · TCK 132-138 listede **VAR** (önceki tabloda eksikti)
 */
export const KATALOG_SUCLAR: readonly { ad: string; maddeler: string }[] = [
  { ad: 'Kasten öldürme', maddeler: 'TCK 81, 82, 83' },
  { ad: 'Neticesi sebebiyle ağırlaşmış yaralama', maddeler: 'TCK 87/2-d' },
  { ad: 'İşkence ve eziyet', maddeler: 'TCK 94, 95, 96' },
  {
    ad: 'Cinsel suçlar (temel hâller)',
    maddeler: 'TCK 102 (2. fıkra hariç), 104 (2-3. fıkra hariç), 105',
  },
  { ad: 'Özel hayata ve hayatın gizli alanına karşı suçlar', maddeler: 'TCK 132-138' },
  { ad: 'Devlet sırlarına karşı suçlar ve casusluk', maddeler: 'TCK 326-339' },
  {
    ad: 'Örgüt kurmak, yönetmek veya örgüt faaliyeti çerçevesinde işlenen suçlar',
    maddeler: 'TCK 220 — m.107/2 son cümle',
  },
];

export type SucKategorisi =
  | 'adi'
  | 'katalog'
  | 'nitelikli-cinsel'
  | 'teror'
  /** TCK 188 — oranı kullanıcı seçer, araç atamaz. */
  | 'uyusturucu';

export type UyusturucuOrani = 'ucte-iki' | 'dortte-uc';

export type Tekerrur = 'yok' | 'birinci' | 'ikinci';

const ORAN = {
  yarim: { pay: 1, payda: 2, metin: '1/2' },
  ucteIki: { pay: 2, payda: 3, metin: '2/3' },
  dortteUc: { pay: 3, payda: 4, metin: '3/4' },
} as const;

/**
 * Suç kategorisinin temel oranı.
 *
 * Terör, m.107 tablosundan DEĞİL, 3713 m.17'den geliyor — ayrı dal
 * olması § 1.13/3'ün açık talebi.
 */
export function temelOran(
  kategori: SucKategorisi,
  uyusturucuOrani?: UyusturucuOrani
): Oran | { hata: 'uyusturucu-orani-secilmedi' } {
  switch (kategori) {
    case 'adi':
      return { ...ORAN.yarim, dayanak: D.genel };
    case 'katalog':
      return { ...ORAN.ucteIki, dayanak: D.katalog };
    case 'nitelikli-cinsel':
      return { ...ORAN.dortteUc, dayanak: D.nitelikliCinsel };
    case 'teror':
      // AYRI DAL — 5275 m.107 tablosuna hiç bakılmıyor.
      return { ...ORAN.dortteUc, dayanak: D.teror };
    case 'uyusturucu':
      if (uyusturucuOrani === undefined) {
        // Araç oranı KENDİ SEÇMEZ. § 1.13/4.
        return { hata: 'uyusturucu-orani-secilmedi' };
      }
      return {
        ...(uyusturucuOrani === 'ucte-iki' ? ORAN.ucteIki : ORAN.dortteUc),
        dayanak: D.uyusturucu,
      };
  }
}

/** Mükerrirlik oranı — m.108. */
export function mukerrirOrani(tekerrur: Tekerrur): Oran | undefined {
  if (tekerrur === 'yok') return undefined;
  return tekerrur === 'birinci'
    ? { ...ORAN.ucteIki, dayanak: D.mukerrir }
    : { ...ORAN.dortteUc, dayanak: D.mukerrir };
}

/**
 * Çakışma hâlinde YÜKSEK oran uygulanır (§ 1.4 sonu).
 *
 * "Yüksek" = hükümlü aleyhine, yani kurumda daha uzun kalınan.
 * Karşılaştırma kesirler üzerinden yapılıyor; ondalığa çevirmek
 * 2/3 ile 0,667 gibi kıyaslarda hataya açık olurdu.
 */
export function yuksekOran(a: Oran, b: Oran | undefined): Oran {
  if (!b) return a;
  return a.pay * b.payda >= b.pay * a.payda ? a : b;
}
