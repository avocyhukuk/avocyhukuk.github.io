/**
 * Kira artış oranı hesabı — saf fonksiyonlar.
 *
 * Dayanak: TBK m. 344/1. Yenilenen kira dönemlerinde uygulanacak artış,
 * bir önceki kira yılında TÜFE'nin on iki aylık ortalamalara göre değişim
 * oranını GEÇEMEZ.
 *
 * ─── SONUÇ "YENİ KİRA" DEĞİL, "AZAMİ BEDEL" ───────────────────────────
 * Kanun anlaşmayı "...oranını geçmemek koşuluyla" geçerli sayıyor.
 * Sözleşmede daha düşük bir artış kararlaştırılmışsa O geçerlidir; tavan
 * kendiliğinden uygulanmaz. Bu yüzden fonksiyon hem tavanı hem —
 * sözleşme oranı verilmişse — fiilen uygulanacak tutarı ayrı ayrı
 * döndürüyor. Arayüz ikisini karıştırmamalı.
 *
 * ─── YUVARLAMA ────────────────────────────────────────────────────────
 * Tam liraya yuvarlama YAPILMAZ; ham sonuç döner (karar: taraflara
 * bırakılıyor). Hesap kuruş tamsayısı üzerinden yapılır: ondalıklı
 * çarpım kayan nokta hatası üretiyor (27.500 × %31,79 float'ta
 * 8742,249999… veriyor), kuruş tabanında bu sorun doğmuyor.
 *
 * ─── KAPSAM ───────────────────────────────────────────────────────────
 * Beş yıl kuralı (TBK m. 344/3) ve geçmiş dönem hesabı v1 kapsamı
 * dışında — bkz. docs/hesaplama-formulleri.md § 3.3. Beş yıldan uzun
 * kira ilişkilerinde bedel endeksle sınırlı olmadığı için sonuç ekranı
 * kapsam notu göstermek zorunda.
 */
import { oranBul, type TufeOrani } from './tufe';

export interface KiraArtisGirdi {
  /** Mevcut aylık kira bedeli, TL. */
  mevcutKira: number;
  /** Yenileme ayı. Biçim: `YYYY-MM`. */
  yenilemeAyi: string;
  /** Sözleşmede kararlaştırılmış artış oranı, yüzde. Verilmeyebilir. */
  sozlesmeOrani?: number;
}

export type KiraArtisSonucu =
  | { durum: 'gecersiz-kira' }
  | { durum: 'gecersiz-oran' }
  | { durum: 'oran-bulunamadi'; yenilemeAyi: string }
  | {
      durum: 'hesaplandi';
      yenilemeAyi: string;
      /** TÜFE on iki aylık ortalama oranı, yüzde. */
      tavanOrani: number;
      /** Oranın okunduğu TÜİK bülteninin ayı. */
      kaynakBulten: string;
      /** Tavan uygulandığında artış tutarı, TL. */
      azamiArtis: number;
      /** Tavan uygulandığında ulaşılabilecek bedel, TL. */
      azamiBedel: number;
      /** Sözleşme oranı verildiyse aynen; verilmediyse undefined. */
      sozlesmeOrani?: number;
      /** Sözleşme oranı tavanı aşıyor mu? Oran verilmediyse undefined. */
      sozlesmeTavaniAsiyor?: boolean;
      /** Fiilen uygulanacak oran — sözleşme oranı ile tavanın küçüğü. */
      uygulanacakOran: number;
      /** Fiilen uygulanacak artış tutarı, TL. */
      uygulanacakArtis: number;
      /** Fiilen uygulanacak yeni bedel, TL. */
      uygulanacakBedel: number;
    };

/**
 * Yüzde oranını yüzde-yüzüncüsü tamsayısına çevirir (31.79 → 3179).
 *
 * TÜFE oranları en fazla iki ondalık taşıdığı için bu dönüşüm kayıpsız;
 * hesabın tamsayı aritmetiğinde kalmasını sağlıyor.
 */
function oranTamsayi(oran: number): number {
  return Math.round(oran * 100);
}

/**
 * Artış tutarını kuruş tamsayısı üzerinden hesaplar.
 *
 * kurus × (oran/10000) — bölme en sonda yapılır ki ara sonuç tamsayı
 * kalsın. Kuruşun altı yuvarlanır; para birimi zaten kuruşa kadar.
 */
function artisHesapla(mevcutKira: number, oran: number): number {
  const mevcutKurus = Math.round(mevcutKira * 100);
  const artisKurus = Math.round((mevcutKurus * oranTamsayi(oran)) / 10000);
  return artisKurus / 100;
}

/** Girdiyi doğrular, tavanı bulur ve sonucu hesaplar. */
export function kiraArtisiHesapla(girdi: KiraArtisGirdi): KiraArtisSonucu {
  const { mevcutKira, yenilemeAyi, sozlesmeOrani } = girdi;

  if (!Number.isFinite(mevcutKira) || mevcutKira <= 0) {
    return { durum: 'gecersiz-kira' };
  }

  if (sozlesmeOrani !== undefined && (!Number.isFinite(sozlesmeOrani) || sozlesmeOrani < 0)) {
    return { durum: 'gecersiz-oran' };
  }

  const kayit: TufeOrani | undefined = oranBul(yenilemeAyi);
  if (!kayit) {
    // Tahmin YOK: oran işlenmemişse hesap yapılmaz. Bayat bir oranla
    // sessizce yanlış tavan göstermek, bu araçtaki en ağır hata olurdu.
    return { durum: 'oran-bulunamadi', yenilemeAyi };
  }

  const azamiArtis = artisHesapla(mevcutKira, kayit.oran);
  const azamiBedel = mevcutKira + azamiArtis;

  // Sözleşme oranı yoksa fiilen uygulanacak olan tavandır.
  const uygulanacakOran =
    sozlesmeOrani === undefined ? kayit.oran : Math.min(sozlesmeOrani, kayit.oran);
  const uygulanacakArtis = artisHesapla(mevcutKira, uygulanacakOran);

  return {
    durum: 'hesaplandi',
    yenilemeAyi,
    tavanOrani: kayit.oran,
    kaynakBulten: kayit.kaynakBulten,
    azamiArtis,
    azamiBedel,
    sozlesmeOrani,
    sozlesmeTavaniAsiyor: sozlesmeOrani === undefined ? undefined : sozlesmeOrani > kayit.oran,
    uygulanacakOran,
    uygulanacakArtis,
    uygulanacakBedel: mevcutKira + uygulanacakArtis,
  };
}
