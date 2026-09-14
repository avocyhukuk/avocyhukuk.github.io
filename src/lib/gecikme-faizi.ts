/**
 * Gecikme (temerrüt) faizi hesabı — saf fonksiyonlar.
 *
 * Dayanak: 3095 sayılı Kanun m. 1-3.
 *
 * ─── HESAP TEK ÇARPMA DEĞİL, DÖNEMLERE BÖLME ──────────────────────────
 * Faiz bir tarih ARALIĞI boyunca işliyor ve o aralıkta oran değişmiş
 * olabilir. Aralık, oran dönemlerine bölünüp her dilim kendi oranıyla
 * ayrı hesaplanıyor. Kodun çekirdeği bu bölme; çarpmanın kendisi
 * önemsiz.
 *
 * ─── ANATOSİZM YASAĞI (m.3) ───────────────────────────────────────────
 * Her dilimde çarpan ANAPARA'dır, bir önceki dilimin sonucu değil.
 * Birikmiş faiz anaparaya eklenip üzerine faiz yürütülmüyor. Bu satır
 * gözden kaçarsa sonuç sessizce şişer ve kimse fark etmez.
 *
 * ─── ONAYLANAN SAYIM KURALLARI ────────────────────────────────────────
 * · Yıl paydası her hâlde **365** — artık yılda da 365, 360 kullanılmıyor
 * · Başlangıç günü sayılmaz, bitiş günü sayılır → `gün = bitiş − başlangıç`
 * · Dilim sınırındaki gün **eski (önceki) döneme** yazılır
 * · Her dilim ayrı ayrı kuruşa yuvarlanıp toplanır — cetvel dilimleri
 *   tek tek gösterdiği için satırların toplamı görünen toplamı tutmalı
 *
 * Doğrulanmış örnek (docs/hesaplama-formulleri.md § 4.4):
 * 100.000 TL, 01.01.2024 – 01.10.2026, kanuni faiz → 61.019,18 TL faiz.
 */
import {
  KANUNI_FAIZ_BASLANGIC,
  KANUNI_FAIZ_DONEMLERI,
  type KanuniFaizDonemi,
} from './faiz-oranlari';

/** Yıl paydası. Artık yılda da değişmiyor — onaylanmış kural. */
const YIL_GUN = 365;

export type FaizTuru = 'kanuni' | 'sozlesmesel';

export interface GecikmeFaiziGirdi {
  /** Anapara, TL. */
  anapara: number;
  /** Faizin işlemeye başladığı gün, `YYYY-MM-DD`. Bu gün sayılmaz. */
  baslangic: string;
  /** Faizin işlemeyi bitirdiği gün, `YYYY-MM-DD`. Bu gün sayılır. */
  bitis: string;
  tur: FaizTuru;
  /** Yalnızca `tur: 'sozlesmesel'` iken kullanılır. Yıllık yüzde. */
  sozlesmeOrani?: number;
}

export interface FaizDilimi {
  /** Dilimin başlangıç günü (sayılmaz). */
  baslangic: string;
  /** Dilimin bitiş günü (sayılır). */
  bitis: string;
  gun: number;
  /** Yıllık oran, yüzde. */
  oran: number;
  /** Bu dilimde işleyen faiz, kuruşa yuvarlanmış. */
  faiz: number;
}

export type GecikmeFaiziSonucu =
  | { durum: 'gecersiz-anapara' }
  | { durum: 'gecersiz-tarih' }
  | { durum: 'gecersiz-oran' }
  | { durum: 'kapsam-disi-tarih'; enErken: string }
  | {
      durum: 'hesaplandi';
      anapara: number;
      dilimler: readonly FaizDilimi[];
      toplamGun: number;
      toplamFaiz: number;
      toplamBorc: number;
    };

/**
 * `YYYY-MM-DD` → gün numarası (epoch günü).
 *
 * UTC üzerinden hesaplanıyor: yerel saat dilimiyle yapılan Date
 * aritmetiği yaz saati geçişlerinde bir gün kayabiliyor ve bu hesapta
 * bir gün, uzun aralıklarda liraları etkiliyor.
 */
function guneCevir(iso: string): number | null {
  const eslesme = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!eslesme) return null;

  const yil = Number(eslesme[1]);
  const ay = Number(eslesme[2]);
  const gun = Number(eslesme[3]);
  const zaman = Date.UTC(yil, ay - 1, gun);

  const geri = new Date(zaman);
  // 31 Nisan gibi var olmayan tarihler Date tarafından kaydırılır;
  // kaydırma olduysa girdi geçersizdir.
  if (geri.getUTCFullYear() !== yil || geri.getUTCMonth() !== ay - 1 || geri.getUTCDate() !== gun) {
    return null;
  }

  return zaman / 86_400_000;
}

/** Gün numarasını `YYYY-MM-DD`ye çevirir. */
function tariheCevir(gunNo: number): string {
  return new Date(gunNo * 86_400_000).toISOString().slice(0, 10);
}

/**
 * Dilim faizini kuruş tabanında hesaplar.
 *
 * Oran yüzde-yüzüncüsü tamsayısına çevriliyor (9 → 900), bu yüzden
 * bölende 100 (yüzde) × 100 (oranın ölçeği) = 10.000 var.
 *
 * Günlük tutar ÖNCE bulunup sonra gün sayısıyla çarpılıyor. Üç çarpanı
 * birden çarpmak büyük anaparalarda Number.MAX_SAFE_INTEGER'ı aşıyordu
 * (100 milyon TL × %50 × 20 yıl ≈ 3,6 × 10^17).
 */
function dilimFaizi(anapara: number, oran: number, gun: number): number {
  const anaparaKurus = Math.round(anapara * 100);
  const oranOlcekli = Math.round(oran * 100);
  const gunlukKurus = (anaparaKurus * oranOlcekli) / (10_000 * YIL_GUN);
  return Math.round(gunlukKurus * gun) / 100;
}

/** Sözleşmesel oranda tek dilim üretir; kanuni faizde tabloya göre böler. */
function dilimleriUret(
  girdi: GecikmeFaiziGirdi,
  baslangicGun: number,
  bitisGun: number
): FaizDilimi[] {
  if (girdi.tur === 'sozlesmesel') {
    const gun = bitisGun - baslangicGun;
    return [
      {
        baslangic: tariheCevir(baslangicGun),
        bitis: tariheCevir(bitisGun),
        gun,
        oran: girdi.sozlesmeOrani!,
        faiz: dilimFaizi(girdi.anapara, girdi.sozlesmeOrani!, gun),
      },
    ];
  }

  const dilimler: FaizDilimi[] = [];
  let imlec = baslangicGun;

  for (const donem of KANUNI_FAIZ_DONEMLERI as readonly KanuniFaizDonemi[]) {
    if (imlec >= bitisGun) break;

    // Dönemin son günü; açık uçlu dönemde aralığın sonu.
    const donemSonu = donem.son === null ? bitisGun : guneCevir(donem.son)!;
    const dilimSonu = Math.min(donemSonu, bitisGun);

    // Aralık bu dönemden sonra başlıyorsa dönem atlanır.
    if (dilimSonu <= imlec) continue;

    const gun = dilimSonu - imlec;
    dilimler.push({
      baslangic: tariheCevir(imlec),
      bitis: tariheCevir(dilimSonu),
      gun,
      oran: donem.oran,
      faiz: dilimFaizi(girdi.anapara, donem.oran, gun),
    });

    // İmleç dönemin SON gününe taşınıyor: o gün bu dilimde sayıldı,
    // bir sonrakinde tekrar sayılmayacak. Sınır kuralı burada işliyor.
    imlec = dilimSonu;
  }

  return dilimler;
}

export function gecikmeFaiziHesapla(girdi: GecikmeFaiziGirdi): GecikmeFaiziSonucu {
  const { anapara, tur, sozlesmeOrani } = girdi;

  if (!Number.isFinite(anapara) || anapara <= 0) {
    return { durum: 'gecersiz-anapara' };
  }

  if (tur === 'sozlesmesel') {
    if (sozlesmeOrani === undefined || !Number.isFinite(sozlesmeOrani) || sozlesmeOrani < 0) {
      return { durum: 'gecersiz-oran' };
    }
  }

  const baslangicGun = guneCevir(girdi.baslangic);
  const bitisGun = guneCevir(girdi.bitis);

  if (baslangicGun === null || bitisGun === null || bitisGun <= baslangicGun) {
    return { durum: 'gecersiz-tarih' };
  }

  // Kanuni faizde tablo 01.01.2006'dan başlıyor; öncesi için oran yok.
  // Tahmin yapılmıyor — kira aracındaki bayatlama korumasıyla aynı ilke.
  if (tur === 'kanuni' && baslangicGun < guneCevir(KANUNI_FAIZ_BASLANGIC)!) {
    return { durum: 'kapsam-disi-tarih', enErken: KANUNI_FAIZ_BASLANGIC };
  }

  const dilimler = dilimleriUret(girdi, baslangicGun, bitisGun);

  // Dilimler ayrı ayrı yuvarlandığı için toplam da onların toplamı:
  // cetveldeki satırlar görünen toplamı tutmalı.
  const toplamFaiz = dilimler.reduce((toplam, dilim) => toplam + dilim.faiz, 0);
  const toplamGun = dilimler.reduce((toplam, dilim) => toplam + dilim.gun, 0);

  return {
    durum: 'hesaplandi',
    anapara,
    dilimler,
    toplamGun,
    toplamFaiz: Math.round(toplamFaiz * 100) / 100,
    toplamBorc: Math.round((anapara + toplamFaiz) * 100) / 100,
  };
}
