/**
 * Kira artış tavanı için TÜFE oranları — elle tutulan tablo.
 *
 * ─── HANGİ ORAN ───────────────────────────────────────────────────────
 * TBK m. 344/1'in işaret ettiği rakam, TÜİK'in aylık Tüketici Fiyat
 * Endeksi bülteninde yayımlanan **"on iki aylık ortalamalara göre
 * değişim"** oranıdır.
 *
 * Bülten aynı ay için DÖRT ayrı oran veriyor:
 *   · aylık değişim
 *   · yıllık değişim            ← manşet enflasyon. KİRA İÇİN YANLIŞ.
 *   · on iki aylık ortalamalara göre değişim   ← BU
 *   · yılbaşına göre değişim
 *
 * Fark küçük değil: Aralık 2025 bülteninde yıllık %30,89 iken on iki
 * aylık ortalama %34,88'di. 10.000 TL'lik bir kirada aylık 399 TL fark.
 *
 * ─── HANGİ AYA YAZILIR ────────────────────────────────────────────────
 * Bir ayın bülteni, TAKİP EDEN ayda yenilenen sözleşmelere uygulanır.
 * Bu yüzden tablo `yenilemeAyi` ile anahtarlanıyor; oranın okunduğu
 * bülten `kaynakBulten` alanında ayrıca duruyor ki denetlenebilsin.
 *
 * ─── GÜNCELLEME ───────────────────────────────────────────────────────
 * Her ayın 4'ünde bir bulut ajanı TÜİK bültenine bakıp haber veriyor
 * (bkz. docs/hesaplama-formulleri.md § 3.6). Rakam TÜİK bülteninden
 * teyit edildikten sonra buraya elle eklenir.
 *
 * DİKKAT: İkincil kaynaklar bu oranı sık sık kırpıyor — "%34,88" yerine
 * "4,88", "%31,79" yerine "1,79" yazan sayfalar var. Rakam TÜİK
 * bülteninden okunacak, haber sitesinden değil.
 *
 * Tablo 2026 ile SINIRLI: %25 tavanının yürürlükte olduğu dönem
 * (11.06.2022 – 01.07.2024) v1 kapsamı dışında, o yüzden 2026 öncesine
 * inilmiyor. Tablo her ay bir satır büyür.
 */

export interface TufeOrani {
  /** Bu orana tabi yenileme ayı. Biçim: `YYYY-MM`. */
  yenilemeAyi: string;
  /** On iki aylık ortalamalara göre değişim oranı, yüzde. Ör. 31.79 */
  oran: number;
  /** Oranın okunduğu TÜİK bülteninin ait olduğu ay. Biçim: `YYYY-MM`. */
  kaynakBulten: string;
}

/*
 * KAYITLARIN KAYNAĞI
 *
 * 2026-09 (%31,79): TÜİK Ağustos 2026 bülteninden doğrudan doğrulandı —
 * aynı bülten yıllık değişimi %31,51 olarak veriyor, ikisi karıştırılmasın.
 *
 * 2026-01 … 2026-08: ikincil kaynaklardan derlendi ve Av. Onur Can Yılmaz
 * tarafından 14 Eylül 2026'da onaylandı. TÜİK bülteninden tek tek teyit
 * EDİLMEDİ. Seri monoton azalıyor (hareketli ortalamada beklenen davranış)
 * ve doğrulanmış Eylül değerinde bitiyor — tutarlılık göstergesi, kanıt
 * değil. Bir uyuşmazlıkta bültene bakılmalı.
 *
 * 2026 öncesi bilinçli olarak YOK: %25 tavanı dönemi (11.06.2022 –
 * 01.07.2024) v1 kapsamı dışında ve o dönemin ayrı bir tavan mantığı
 * gerektirir.
 */

/** En yeni ay en üstte. */
export const TUFE_ORANLARI: readonly TufeOrani[] = [
  { yenilemeAyi: '2026-09', oran: 31.79, kaynakBulten: '2026-08' },
  { yenilemeAyi: '2026-08', oran: 31.9, kaynakBulten: '2026-07' },
  { yenilemeAyi: '2026-07', oran: 32.03, kaynakBulten: '2026-06' },
  { yenilemeAyi: '2026-06', oran: 32.24, kaynakBulten: '2026-05' },
  { yenilemeAyi: '2026-05', oran: 32.43, kaynakBulten: '2026-04' },
  { yenilemeAyi: '2026-04', oran: 32.82, kaynakBulten: '2026-03' },
  { yenilemeAyi: '2026-03', oran: 33.39, kaynakBulten: '2026-02' },
  { yenilemeAyi: '2026-02', oran: 33.98, kaynakBulten: '2026-01' },
  { yenilemeAyi: '2026-01', oran: 34.88, kaynakBulten: '2025-12' },
] as const;

/** Verilen yenileme ayının oranını döndürür; tabloda yoksa `undefined`. */
export function oranBul(yenilemeAyi: string): TufeOrani | undefined {
  return TUFE_ORANLARI.find((kayit) => kayit.yenilemeAyi === yenilemeAyi);
}

/** Tabloda oranı bulunan aylar, en yeniden eskiye. Form seçeneklerini besler. */
export function oranliAylar(): readonly TufeOrani[] {
  return [...TUFE_ORANLARI].sort((a, b) => b.yenilemeAyi.localeCompare(a.yenilemeAyi));
}

const AY_ADLARI = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
] as const;

/** `2026-09` → `Eylül 2026`. Geçersiz girdide olduğu gibi döner. */
export function ayAdi(yyyyMm: string): string {
  const [yil, ay] = yyyyMm.split('-');
  const indeks = Number(ay) - 1;
  if (!yil || !AY_ADLARI[indeks]) return yyyyMm;
  return `${AY_ADLARI[indeks]} ${yil}`;
}
