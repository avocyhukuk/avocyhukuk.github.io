/**
 * Limited şirket kuruluş maliyeti tarifeleri — yıl bazlı, elle tutulan tablo.
 *
 * ─── NEDEN YIL BAZLI ──────────────────────────────────────────────────
 * Dört kalemin dördü de her yıl başında yeniden belirleniyor: Ankara
 * Ticaret Odası kayıt/beyanname/tasdik ücretleri ve Türkiye Ticaret
 * Sicili Gazetesi kelime ücreti. `harc-tarifeleri.ts` ile aynı ilke:
 *   · araç hangi yılın tarifesini kullandığını gösterebilsin,
 *   · tarifesi girilmemiş bir yıl için hesap YAPILMASIN.
 *
 * Tabloda OLMAYAN iki değer bilinçli olarak dışarıda:
 *   · Rekabet Kurumu payı oranı — tarifede değil, 4054 sayılı Kanun'da
 *     yazılı (on binde dört). Yıla bağlı değil.
 *   · Asgari esas sermaye — Cumhurbaşkanı Kararı ile değişiyor, yıl
 *     başında değil. Aşağıda ayrı sabit.
 *
 * ─── ANKARA'YA ÖZGÜ ───────────────────────────────────────────────────
 * Oda kayıt ücreti, beyanname ve tasdik bedelleri KAYIT OLUNAN ODAYA
 * göre değişir; buradaki rakamlar Ankara Ticaret Odası tarifesidir.
 * Aracın kapsam notu bunu açıkça söylüyor. Başka bir oda eklenecekse
 * tablo oda × yıl olarak genişletilir.
 *
 * ─── 2026 RAKAMLARININ KAYNAĞI ────────────────────────────────────────
 * ATO 2026 Yılı Kayıt Ücreti Tarifesi (`atonet.org.tr`) ve ticaret
 * sicili tarifeleri; rakamlar Av. Onur Can Yılmaz tarafından verildi.
 * TTSG kelime ücreti kuruluş ilanları için 2,48 TL.
 *
 * Ayrıntılı gerekçe ve doğrulama durumu:
 * docs/hesaplama-formulleri.md § 7.
 */

/**
 * Limited şirkette asgari esas sermaye, TL.
 *
 * 7887 sayılı Cumhurbaşkanı Kararı (RG 25.11.2023 / 32380), yürürlük
 * 01.01.2024. Karar, TTK m. 580'in metnini değiştirmiyor; maddenin
 * Cumhurbaşkanına tanıdığı artırma yetkisini kullanıyor.
 */
export const LIMITED_ASGARI_SERMAYE = 50_000;

/**
 * Rekabet Kurumu payı — sermayenin on binde dördü.
 *
 * 4054 sayılı Kanun m. 39/1-(c). Ondalık sayı yerine kesir olarak
 * tutuluyor çünkü kanun metni de kesir: "on binde dördü". 0,0004 ile
 * çarpmak yerine tam sayı bölmesi yapılınca kuruş artığı doğmuyor.
 */
export const REKABET_PAYI_PAY = 4;
export const REKABET_PAYI_PAYDA = 10_000;

export interface KurulusTarifesi {
  /** Oda kayıt ücreti — sermaye dilimine göre değişmiyor. */
  odaKayit: number;
  /** Beyanname ücreti. Kayıt başına, yetkili başına değil. */
  beyanname: number;
  /** Defter tasdik ve kuruluş tasdik ücreti, birlikte. */
  tasdik: number;
  /** TTSG kuruluş ilanı, kelime başına. */
  ttsgKelime: number;
}

export const KURULUS_TARIFELERI: Readonly<Record<number, KurulusTarifesi>> = {
  2026: {
    odaKayit: 3900,
    beyanname: 250,
    tasdik: 2500,
    ttsgKelime: 2.48,
  },
};

/** Tarifesi girilmiş yıllar, yeniden eskiye. Form seçeneklerini besler. */
export function tarifeliYillar(): number[] {
  return Object.keys(KURULUS_TARIFELERI)
    .map(Number)
    .sort((a, b) => b - a);
}

/** Yılın tarifesi; girilmemişse `undefined`. */
export function tarifeBul(yil: number): KurulusTarifesi | undefined {
  return KURULUS_TARIFELERI[yil];
}
