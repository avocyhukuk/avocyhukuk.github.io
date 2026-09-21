/**
 * Marka tescil süreç takvimi — saf fonksiyonlar.
 *
 * Aşamalar, süreler ve kaynaklar: `marka-asamalari.ts` ve
 * docs/hesaplama-formulleri.md § 8.
 *
 * ─── SEKİZ ARAÇ İÇİNDE TEK TARİH ARACI ────────────────────────────────
 * Diğer yedisi para hesaplıyor, bu takvim hesaplıyor. Dolayısıyla kuruş
 * aritmetiği yerine buradaki dert TAKVİM aritmetiği:
 *
 * 1. **Ay ekleme kırpılmalı.** JavaScript'te 31 Ocak'a bir ay eklemek
 *    3 Mart veriyor (Şubat 28 çekince gün taşıyor). Takvim dilinde doğru
 *    cevap 28 Şubat. `ayEkle` bunu ayın sonuna kırpıyor.
 * 2. **UTC zorunlu.** Yerel saatle yapılan gün aritmetiği, yaz saati
 *    geçişlerinde bir gün kaydırabiliyor. § 4'teki gecikme faizi aracında
 *    aynı gerekçeyle `Date.UTC` kullanılmıştı.
 *
 * ─── SONUÇ TEK TARİH DEĞİL ────────────────────────────────────────────
 * Her aşama için iki tarih dönüyor: en erken ve en geç tamamlanma. Tek
 * tarih vermek, kaynakların bile anlaşamadığı bir süreçte (docs § 8.1)
 * olmayan bir kesinlik iddia etmek olurdu.
 */
import type { LegalReference } from './calculator-ui';
import {
  ASAMALAR,
  ITIRAZLI_DAYANAK,
  ITIRAZLI_SURE,
  SMK_YURURLUK,
  type Sure,
} from './marka-asamalari';

/** Başvuru tarihinin kabul edilen en geç değeri — bariz yazım hatalarını eler. */
export const EN_GEC_BASVURU_YILI = 2100;

export interface AsamaTarihi {
  ad: string;
  aciklama: string;
  /** Aşamanın en erken tamamlanacağı tarih (kümülatif). */
  enErken: Date;
  /** Aşamanın en geç tamamlanacağı tarih (kümülatif). */
  enGec: Date;
  /** Süre kanunda yazılıysa `true` — arayüz bu aşamayı ayrı işaretler. */
  kesin: boolean;
  dayanak: LegalReference;
}

export interface TakvimDali {
  enErken: Date;
  enGec: Date;
  dayanak: LegalReference;
}

export type MarkaTakvimiSonucu =
  | { durum: 'gecersiz-tarih' }
  /** Başvuru SMK'nın yürürlüğünden önce — 556 sayılı KHK rejimi. */
  | { durum: 'smk-oncesi'; yururluk: Date }
  | {
      durum: 'hesaplandi';
      basvuru: Date;
      /** İtiraz gelmeyen dalın aşamaları, sırayla. */
      asamalar: readonly AsamaTarihi[];
      /** İtiraz gelmezse tescilin beklendiği aralık — son aşamanın tarihleri. */
      itirazsiz: TakvimDali;
      /** İtiraz gelirse tescilin beklendiği aralık. */
      itirazli: TakvimDali;
    };

/**
 * Tarihe ay ekler ve ayın son gününe KIRPAR.
 *
 * `Date.UTC(2026, 0, 31 + ...)` taşma yapıyor: 31 Ocak + 1 ay → 3 Mart.
 * Takvim dilinde doğrusu 28 Şubat. Hedef ayın gün sayısını bulup günü
 * onunla sınırlıyoruz.
 */
function ayEkle(tarih: Date, ay: number): Date {
  const yil = tarih.getUTCFullYear();
  const mevcutAy = tarih.getUTCMonth();
  const gun = tarih.getUTCDate();

  // Hedef ayın gün sayısı: bir sonraki ayın 0'ıncı günü = bu ayın sonu.
  const hedefAyinGunSayisi = new Date(Date.UTC(yil, mevcutAy + ay + 1, 0)).getUTCDate();

  return new Date(Date.UTC(yil, mevcutAy + ay, Math.min(gun, hedefAyinGunSayisi)));
}

function gunEkle(tarih: Date, gun: number): Date {
  return new Date(tarih.getTime() + gun * 86_400_000);
}

function sureEkle(tarih: Date, sure: Sure): Date {
  return sure.birim === 'ay' ? ayEkle(tarih, sure.deger) : gunEkle(tarih, sure.deger * 7);
}

/** Günün başına çeker — saat bilgisi sonuçları kirletmesin. */
function guneYuvarla(tarih: Date): Date {
  return new Date(Date.UTC(tarih.getUTCFullYear(), tarih.getUTCMonth(), tarih.getUTCDate()));
}

export function markaTakvimiHesapla(basvuruTarihi: Date): MarkaTakvimiSonucu {
  if (Number.isNaN(basvuruTarihi.getTime())) {
    return { durum: 'gecersiz-tarih' };
  }

  const basvuru = guneYuvarla(basvuruTarihi);

  if (basvuru.getUTCFullYear() > EN_GEC_BASVURU_YILI) {
    return { durum: 'gecersiz-tarih' };
  }

  if (basvuru.getTime() < SMK_YURURLUK) {
    // Öncesi 556 sayılı KHK rejimi: aşama yapısı ve süreler farklı.
    // Sessizce yanlış takvim üretmektense hesap yapmıyoruz.
    return { durum: 'smk-oncesi', yururluk: new Date(SMK_YURURLUK) };
  }

  // İki yol paralel ilerliyor: min yol minleri, max yol maxları toplar.
  let enErken = basvuru;
  let enGec = basvuru;

  const asamalar: AsamaTarihi[] = ASAMALAR.map((asama) => {
    enErken = sureEkle(enErken, asama.min);
    enGec = sureEkle(enGec, asama.max);

    return {
      ad: asama.ad,
      aciklama: asama.aciklama,
      enErken,
      enGec,
      kesin: asama.kesin === true,
      dayanak: asama.dayanak,
    };
  });

  const son = asamalar[asamalar.length - 1]!;

  return {
    durum: 'hesaplandi',
    basvuru,
    asamalar,
    itirazsiz: { enErken: son.enErken, enGec: son.enGec, dayanak: son.dayanak },
    itirazli: {
      enErken: sureEkle(basvuru, ITIRAZLI_SURE.min),
      enGec: sureEkle(basvuru, ITIRAZLI_SURE.max),
      dayanak: ITIRAZLI_DAYANAK,
    },
  };
}
