/**
 * Şirket kuruluş maliyeti tarifeleri — yıl bazlı, elle tutulan tablo.
 *
 * ─── NEDEN YIL BAZLI ──────────────────────────────────────────────────
 * Dört kalemin dördü de her yıl başında yeniden belirleniyor: Ankara
 * Ticaret Odası kayıt/beyanname/tasdik ücretleri ve Türkiye Ticaret
 * Sicili Gazetesi kelime ücreti. `harc-tarifeleri.ts` ile aynı ilke:
 *   · araç hangi yılın tarifesini kullandığını gösterebilsin,
 *   · tarifesi girilmemiş bir yıl için hesap YAPILMASIN.
 *
 * Tabloda OLMAYAN üç değer bilinçli olarak dışarıda — hiçbiri yıla bağlı
 * değil, hepsi aşağıda ayrı sabit:
 *   · Rekabet Kurumu payı oranı — 4054 sayılı Kanun'da yazılı (on binde
 *     dört).
 *   · Asgari esas sermaye — Cumhurbaşkanı Kararı ile değişiyor.
 *   · Anonim şirket sermaye blokajı oranı — TTK m. 344'te yazılı.
 *
 * ─── LİMİTED VE ANONİM ────────────────────────────────────────────────
 * Tarife kalemleri iki tür için de aynı: oda kayıt, beyanname ve tasdik
 * ücretleri şirket türüne göre değişmiyor (kaynak tarifede "AŞ-LTD-KOOP"
 * ortak yazıyor). Türe bağlı olan iki şey tarifede değil, aşağıdaki
 * sabitlerde: asgari sermaye ve anonim şirkete özgü sermaye blokajı.
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
 * Aracın hesapladığı şirket türleri.
 *
 * Kayıtlı sermaye sistemini kabul eden anonim şirket (başlangıç sermayesi
 * 500.000 TL) bilinçli olarak YOK: nadir kullanılan bir seçenek, forma
 * üçüncü bir tür eklemek kazandıracağı isabetten fazla karmaşıklık
 * getirirdi. Kapsam notunda açıkça söyleniyor (docs § 7.12).
 */
export type SirketTuru = 'limited' | 'anonim';

/**
 * Türe göre asgari esas sermaye, TL.
 *
 * 7887 sayılı Cumhurbaşkanı Kararı (RG 25.11.2023 / 32380), yürürlük
 * 01.01.2024. Karar, TTK m. 332 ve m. 580'in metnini değiştirmiyor; bu
 * maddelerin Cumhurbaşkanına tanıdığı artırma yetkisini kullanıyor.
 *
 * Tarife tablosunda DEĞİL, çünkü yıl başında değil Cumhurbaşkanı Kararı
 * ile değişiyor.
 */
export const ASGARI_SERMAYE: Readonly<Record<SirketTuru, number>> = {
  limited: 50_000,
  anonim: 250_000,
};

/**
 * Anonim şirkette tescilden önce bankada bloke edilecek asgari oran, yüzde.
 *
 * TTK m. 344/1: nakden taahhüt edilen payların itibarî değerlerinin en az
 * yüzde yirmibeşi tescilden önce ödenir. TTK m. 345/1: ödeme, kurulmakta
 * olan şirket adına açılan özel banka hesabına yapılır; banka tutarı ancak
 * tüzel kişiliğin kazanıldığını bildiren sicil müdürlüğü yazısı üzerine
 * şirkete öder.
 *
 * **Bu bir masraf değil** — tescilden sonra şirkete geçiyor. Toplama
 * girmiyor, kalem olarak da eklenmiyor; yalnızca bilgi notunda gösteriliyor.
 *
 * Limitedde bu şart yok: 7099 s.K. sonrası sermaye tescilden sonra yirmi
 * dört ay içinde ödenebiliyor.
 */
export const AS_BLOKAJ_YUZDE = 25;

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
