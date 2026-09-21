/**
 * Limited şirket kuruluş maliyeti — saf fonksiyonlar.
 *
 * Formül, kapsam ve kaynaklar: docs/hesaplama-formulleri.md § 7.
 *
 * ─── ARAŞTIRMANIN İKİ BULGUSU BU DOSYAYI ŞEKİLLENDİRDİ ────────────────
 * 1. **Ticaret sicili tescil harcı kuruluşta ALINMIYOR.** 492 sayılı
 *    Harçlar Kanunu m. 123, limited şirket kuruluşunu harçtan tam
 *    istisna tutuyor. 2026 tarifesinde bu kalem 35.354,50 TL olarak
 *    duruyor ve piyasadaki kuruluş maliyeti listelerinde en büyük rakam
 *    olarak dolaşıyor — ama tahsil edilmiyor.
 *
 *    Kalem yine de listede, değeri 0,00 ve `bilgi: true` ile. Satırı hiç
 *    göstermeseydik kullanıcı "harcı unutmuşlar" derdi; sıfır gösterip
 *    dayanağını yazınca istisnayı öğretmiş oluyoruz.
 *
 * 2. **Noter masrafı zorunlu bir kalem değil.** Ana sözleşme 2018'den
 *    beri ticaret sicili müdürlüğünde ücretsiz imzalanıyor (7099 s.K.
 *    ile değişik TTK m. 575). Noter yalnızca vekâletname verilecekse
 *    devreye giriyor — hesaba katılmıyor, sonuç ekranında not olarak
 *    söyleniyor.
 *
 * ─── TOPLAMA GİRMEYEN KALEMLER ────────────────────────────────────────
 * Mali müşavir ücreti ve e-imza/mali mühür bedelleri resmî bir tarifeye
 * bağlı olmadığı için hesapta YOK. İkisi de sonuç ekranında ayrıca
 * söyleniyor; sessizce dışarıda bırakılmıyorlar.
 *
 * ─── ARİTMETİK ────────────────────────────────────────────────────────
 * Kuruş tabanlı tam sayı — § 3, § 4, § 5 ve § 6 ile aynı. Rekabet payı
 * ondalıkla (× 0,0004) değil kesirle (× 4 / 10.000) hesaplanıyor: kanun
 * metni de kesir, ve tam sayı bölmesi kuruş artığı üretmiyor.
 */
import type { LegalReference } from './calculator-ui';
import {
  LIMITED_ASGARI_SERMAYE,
  REKABET_PAYI_PAY,
  REKABET_PAYI_PAYDA,
  tarifeBul,
  type KurulusTarifesi,
} from './kurulus-tarifeleri';

/** Sermaye tavanı — taşma koruması, makul bir sınır değil. */
export const EN_COK_SERMAYE = 1_000_000_000;

/** Kelime sayısı tavanı — taşma koruması. */
export const EN_COK_KELIME = 100_000;

const D = {
  harcIstisnasi: {
    short: '492 m.123',
    full: '492 sayılı Harçlar Kanunu m. 123 — Limited şirket kuruluş işlemleri harçlardan müstesnadır',
  },
  oda: {
    short: 'ATO tarifesi',
    full: 'Ankara Ticaret Odası kayıt ücreti ve ticaret sicili hizmet bedelleri tarifesi',
  },
  ttsg: {
    short: 'TTSG tarifesi',
    full: 'Türkiye Ticaret Sicili Gazetesi ilan ücreti tarifesi — kuruluş ilanlarında kelime başına',
  },
  rekabet: {
    short: '4054 m.39/1-c',
    full: '4054 sayılı Rekabetin Korunması Hakkında Kanun m. 39/1-(c) ve 2017/4 sayılı Tebliğ — sermayenin on binde dördü',
  },
} as const satisfies Record<string, LegalReference>;

export interface KurulusKalemi {
  ad: string;
  tutar: number;
  detay?: string;
  dayanak?: LegalReference;
  /** true ise toplama KATILMAZ — ödenmeyen, bilgi amaçlı satır. */
  bilgi?: boolean;
}

export interface KurulusGirdi {
  yil: number;
  /** Esas sermaye, TL. Asgari tutarın altında olamaz. */
  sermaye: number;
  /** Ana sözleşmenin kelime sayısı — TTSG ilan ücretinin tabanı. */
  kelimeSayisi: number;
}

export type KurulusSonucu =
  | { durum: 'tarife-yok'; yil: number }
  /** Sermaye sayı değil, asgari tutarın altında veya tavanı aşıyor. */
  | { durum: 'gecersiz-sermaye'; asgari: number }
  | { durum: 'gecersiz-kelime' }
  | {
      durum: 'hesaplandi';
      yil: number;
      kalemler: readonly KurulusKalemi[];
      /** Kuruluşta ödenecek toplam — `bilgi` satırları hariç. */
      toplam: number;
    };

function tl(kurus: number): number {
  return kurus / 100;
}

/** Tutarı TR biçiminde gösterir — açıklama satırları için. */
function yaz(tutar: number): string {
  return tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
}

function kalemleriKur(g: KurulusGirdi, t: KurulusTarifesi): KurulusKalemi[] {
  const sermayeKurus = Math.round(g.sermaye * 100);

  // Kesirle hesap: 50.000 TL → 5.000.000 kuruş × 4 = 20.000.000 / 10.000
  // = 2.000 kuruş = 20,00 TL. Ondalıkla çarpımda artık kalıyordu.
  const rekabetKurus = Math.round((sermayeKurus * REKABET_PAYI_PAY) / REKABET_PAYI_PAYDA);

  const ttsgKurus = Math.round(t.ttsgKelime * 100) * g.kelimeSayisi;

  return [
    {
      ad: 'Ticaret sicili tescil harcı',
      tutar: 0,
      detay: 'Limited şirket kuruluşunda alınmaz — tam istisna',
      dayanak: D.harcIstisnasi,
      bilgi: true,
    },
    { ad: 'Oda kayıt ücreti', tutar: t.odaKayit, dayanak: D.oda },
    {
      ad: 'Beyanname ücreti',
      tutar: t.beyanname,
      detay: 'Kayıt başına',
      dayanak: D.oda,
    },
    { ad: 'Defter ve kuruluş tasdik ücreti', tutar: t.tasdik, dayanak: D.oda },
    {
      ad: 'Ticaret Sicili Gazetesi ilan ücreti',
      tutar: tl(ttsgKurus),
      detay: `${g.kelimeSayisi.toLocaleString('tr-TR')} kelime × ${yaz(t.ttsgKelime)} TL`,
      dayanak: D.ttsg,
    },
    {
      ad: 'Rekabet Kurumu payı',
      tutar: tl(rekabetKurus),
      detay: `Sermayenin on binde dördü (${yaz(g.sermaye)} TL)`,
      dayanak: D.rekabet,
    },
  ];
}

export function kurulusMaliyetiHesapla(girdi: KurulusGirdi): KurulusSonucu {
  const t = tarifeBul(girdi.yil);
  if (!t) {
    // Tahmin YOK: tarifesi girilmemiş yıl için hesap yapılmaz.
    return { durum: 'tarife-yok', yil: girdi.yil };
  }

  // Asgari sermayenin altında hesap YAPILMIYOR. Sonucu verip "ama bu
  // sermayeyle şirket kurulamaz" demek yerine baştan reddedip sebebini
  // söylüyoruz — kullanıcı rakamı görüp sınırı atlayabilirdi.
  const sermayeGecersiz =
    !Number.isFinite(girdi.sermaye) ||
    girdi.sermaye < LIMITED_ASGARI_SERMAYE ||
    girdi.sermaye > EN_COK_SERMAYE;
  if (sermayeGecersiz) {
    return { durum: 'gecersiz-sermaye', asgari: LIMITED_ASGARI_SERMAYE };
  }

  const kelimeGecersiz =
    !Number.isInteger(girdi.kelimeSayisi) ||
    girdi.kelimeSayisi < 1 ||
    girdi.kelimeSayisi > EN_COK_KELIME;
  if (kelimeGecersiz) {
    return { durum: 'gecersiz-kelime' };
  }

  const kalemler = kalemleriKur(girdi, t);

  const toplamKurus = kalemler
    .filter((k) => !k.bilgi)
    .reduce((toplam, k) => toplam + Math.round(k.tutar * 100), 0);

  return { durum: 'hesaplandi', yil: girdi.yil, kalemler, toplam: tl(toplamKurus) };
}
