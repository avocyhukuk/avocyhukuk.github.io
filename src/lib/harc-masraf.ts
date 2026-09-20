/**
 * Dava ve icra takibi AÇILIŞ maliyeti — saf fonksiyonlar.
 *
 * Formül, kapsam ve kaynaklar: docs/hesaplama-formulleri.md § 6.
 *
 * ─── BU ARAÇ ÖNCEKİLERDEN FARKLI ──────────────────────────────────────
 * Kira'da tek orana tek çarpma, faizde dönemlere bölme vardı. Burada
 * KOŞULLU BİR KALEM LİSTESİ toplanıyor: hangi kalemin listeye gireceği
 * işlem türüne, konunun para ile ölçülüp ölçülemediğine, mahkemeye,
 * taraf sayısına ve avukatla takip edilip edilmediğine bağlı.
 *
 * ─── AÇILIŞ MALİYETİ, TOPLAM MALİYET DEĞİL ────────────────────────────
 * Bakiye nispi harç karar aşamasında, tahsil harcı tahsilat anında
 * ödeniyor. İkisi de sonuçta BİLGİ satırı olarak dönüyor (`bilgi: true`)
 * ve toplama katılmıyor. Vekâlet ücreti (AAÜT) kapsam dışı.
 *
 * ─── ONAYLANAN YORUM ──────────────────────────────────────────────────
 * Nispi harçta asgari taban (732,00 TL) NİSPİ HARCA uygulanır, peşin
 * harç bundan sonra 1/4 olarak alınır. Yani 5.000 TL'lik bir davada
 * ham nispi harç 341,55 → taban 732,00 → peşin 183,00.
 *
 * Alternatif okuma (tabanın doğrudan peşin harca uygulanması) peşin
 * harcı 732,00 yapardı — dört kat fark. 492 s.K. m. 28'in lafzı
 * ("nispi karar ve ilam harcının dörtte biri") ilk okumayı destekliyor
 * ve Av. Onur Can Yılmaz bu yorumu onayladı. `harc-masraf.test.ts`
 * içinde adı geçen bir testle sabitlendi: yorum değişirse tek test
 * kırılır ve nerede düzeltileceği belli olur.
 */
import { tarifeBul, type HarcTarifesi } from './harc-tarifeleri';

export interface Dayanak {
  short: string;
  full: string;
}

const D = {
  basvurma: { short: '492 s.K.', full: '492 sayılı Harçlar Kanunu, (1) Sayılı Tarife' },
  pesin: {
    short: '492 m.28',
    full: '492 sayılı Harçlar Kanunu m. 28 — Nispi harcın dörtte biri peşin alınır',
  },
  icraPesin: {
    short: '492 m.29',
    full: '492 sayılı Harçlar Kanunu m. 29 — İcra takiplerinde peşin harç',
  },
  giderAvansi: {
    short: 'HMK m.114/120',
    full: 'HMK m. 114 ve 120 ile Gider Avansı Tarifesi m. 4',
  },
  icraMasraf: {
    short: 'İİK m.59',
    full: '2004 sayılı İcra ve İflas Kanunu m. 59 — Masrafların peşin ödenmesi',
  },
  vekalet: {
    short: '1136 m.27',
    full: '1136 sayılı Avukatlık Kanunu m. 27 — Vekâletnamelerde pul yapıştırılması',
  },
} as const;

export interface MasrafKalemi {
  ad: string;
  tutar: number;
  detay?: string;
  dayanak?: Dayanak;
  /** true ise toplama KATILMAZ — açılışta ödenmeyen, bilgi amaçlı satır. */
  bilgi?: boolean;
}

export type MahkemeTuru = 'sulh' | 'asliye';
export type TakipTuru = 'ilamsiz' | 'ilamli';

export interface DavaGirdi {
  tur: 'dava';
  yil: number;
  mahkeme: MahkemeTuru;
  /** Konusu para ile ölçülebiliyorsa dava değeri; ölçülemiyorsa undefined. */
  davaDegeri?: number;
  tarafSayisi: number;
  avukatli: boolean;
}

export interface IcraGirdi {
  tur: 'icra';
  yil: number;
  takip: TakipTuru;
  /** İlamsız ve kambiyo takiplerinde peşin harcın tabanı. */
  alacak?: number;
  borcluSayisi: number;
  avukatli: boolean;
}

export type HarcMasrafGirdi = DavaGirdi | IcraGirdi;

export type HarcMasrafSonucu =
  | { durum: 'tarife-yok'; yil: number }
  | { durum: 'gecersiz-deger' }
  | { durum: 'gecersiz-taraf' }
  | {
      durum: 'hesaplandi';
      yil: number;
      kalemler: readonly MasrafKalemi[];
      /** Açılışta ödenecek toplam — `bilgi` satırları hariç. */
      toplam: number;
    };

/** Kuruş tabanlı çarpım; ondalıklı ara çarpım kayan nokta kaybı üretiyor. */
function binde(tutar: number, binde: number): number {
  const kurus = Math.round(tutar * 100);
  // binde 68,31 → 6831 / 100000
  return Math.round((kurus * Math.round(binde * 100)) / 100_000) / 100;
}

function dortteBir(tutar: number): number {
  return Math.round(tutar * 100 * 0.25) / 100;
}

function davaHesapla(g: DavaGirdi, t: HarcTarifesi): HarcMasrafSonucu {
  if (!Number.isInteger(g.tarafSayisi) || g.tarafSayisi < 2) {
    // En az bir davacı ve bir davalı olmalı.
    return { durum: 'gecersiz-taraf' };
  }

  const nispiMi = g.davaDegeri !== undefined;
  if (nispiMi && (!Number.isFinite(g.davaDegeri!) || g.davaDegeri! <= 0)) {
    return { durum: 'gecersiz-deger' };
  }

  const kalemler: MasrafKalemi[] = [];

  const basvurma = g.mahkeme === 'sulh' ? t.basvurmaSulh : t.basvurmaAsliye;
  kalemler.push({
    ad: 'Başvurma harcı',
    tutar: basvurma,
    detay: g.mahkeme === 'sulh' ? 'Sulh mahkemeleri' : 'Asliye ve idare mahkemeleri',
    dayanak: D.basvurma,
  });

  if (nispiMi) {
    const ham = binde(g.davaDegeri!, t.nispiBinde);
    const nispi = Math.max(ham, t.nispiAsgari);
    const tabanUygulandi = nispi > ham;
    const pesin = dortteBir(nispi);

    kalemler.push({
      ad: 'Peşin harç',
      tutar: pesin,
      detay: tabanUygulandi
        ? `Nispi harç ${t.nispiAsgari.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL asgari tabana yükseltildi; dörtte biri`
        : `Nispi harcın (binde ${t.nispiBinde}) dörtte biri`,
      dayanak: D.pesin,
    });

    kalemler.push({
      ad: 'Bakiye nispi karar ve ilam harcı',
      tutar: Math.round((nispi - pesin) * 100) / 100,
      detay: 'Karar aşamasında ödenir — açılış maliyetine dahil değildir',
      dayanak: D.basvurma,
      bilgi: true,
    });
  } else {
    kalemler.push({
      ad: 'Maktu karar ve ilam harcı',
      tutar: t.maktuKararIlam,
      detay: 'Konusu para ile ölçülemeyen davalar; peşin ödenir',
      dayanak: D.basvurma,
    });
  }

  const tebligat = Math.round(g.tarafSayisi * t.tebligatKatsayisi * t.tebligat * 100) / 100;
  kalemler.push({
    ad: 'Gider avansı — tebligat',
    tutar: tebligat,
    detay: `${g.tarafSayisi} taraf × ${t.tebligatKatsayisi} × ${t.tebligat} TL`,
    dayanak: D.giderAvansi,
  });

  kalemler.push({
    ad: 'Gider avansı — diğer iş ve işlemler',
    tutar: t.giderAvansiMaktu,
    dayanak: D.giderAvansi,
  });

  if (g.avukatli) {
    kalemler.push(
      { ad: 'Baro pulu', tutar: t.baroPulu, dayanak: D.vekalet },
      { ad: 'Vekâlet suret harcı', tutar: t.vekaletSuret, dayanak: D.basvurma }
    );
  }

  return topla(g.yil, kalemler);
}

function icraHesapla(g: IcraGirdi, t: HarcTarifesi): HarcMasrafSonucu {
  if (!Number.isInteger(g.borcluSayisi) || g.borcluSayisi < 1) {
    return { durum: 'gecersiz-taraf' };
  }

  const pesinVar = g.takip === 'ilamsiz';
  if (pesinVar && (!Number.isFinite(g.alacak ?? NaN) || (g.alacak ?? 0) <= 0)) {
    return { durum: 'gecersiz-deger' };
  }

  const kalemler: MasrafKalemi[] = [
    { ad: 'Başvuru harcı', tutar: t.icraBasvuru, dayanak: D.basvurma },
  ];

  if (pesinVar) {
    kalemler.push({
      ad: 'Peşin harç',
      tutar: binde(g.alacak!, t.icraPesinBinde),
      detay: `Alacağın binde ${t.icraPesinBinde}'i`,
      dayanak: D.icraPesin,
    });
  } else {
    kalemler.push({
      ad: 'Peşin harç alınmaz',
      tutar: 0,
      detay: 'İlamlı takipte peşin harç öngörülmemiştir',
      dayanak: D.icraPesin,
      bilgi: true,
    });
  }

  // İİK'da katlamalı gider avansı yok: işlem başına masraf peşin ödenir.
  // Açılışta yalnızca ödeme/icra emri tebliği var.
  kalemler.push({
    ad: 'Tebligat',
    tutar: Math.round(g.borcluSayisi * t.tebligat * 100) / 100,
    detay: `${g.borcluSayisi} borçlu × ${t.tebligat} TL (ödeme/icra emri)`,
    dayanak: D.icraMasraf,
  });

  if (g.avukatli) {
    kalemler.push(
      { ad: 'Baro pulu', tutar: t.baroPulu, dayanak: D.vekalet },
      { ad: 'Vekâlet suret harcı', tutar: t.vekaletSuret, dayanak: D.basvurma }
    );
  }

  return topla(g.yil, kalemler);
}

function topla(yil: number, kalemler: MasrafKalemi[]): HarcMasrafSonucu {
  const toplam = kalemler
    .filter((k) => !k.bilgi)
    .reduce((t, k) => t + Math.round(k.tutar * 100), 0);

  return { durum: 'hesaplandi', yil, kalemler, toplam: toplam / 100 };
}

export function harcMasrafHesapla(girdi: HarcMasrafGirdi): HarcMasrafSonucu {
  const t = tarifeBul(girdi.yil);
  if (!t) {
    // Tahmin YOK: tarifesi girilmemiş yıl için hesap yapılmaz.
    return { durum: 'tarife-yok', yil: girdi.yil };
  }

  return girdi.tur === 'dava' ? davaHesapla(girdi, t) : icraHesapla(girdi, t);
}
