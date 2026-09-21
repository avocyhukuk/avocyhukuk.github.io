/**
 * Araç mahrumiyet bedeli — saf fonksiyonlar.
 *
 * Formül, kapsam ve kaynaklar: docs/hesaplama-formulleri.md § 5.
 *
 * ─── BU ARAÇTA KODDA RAKAM YOK ────────────────────────────────────────
 * Diğer üç araçta bir veri tablosu vardı ve hepsinin ortak derdi
 * bayatlamaktı: TÜFE (`tufe.ts`), kanuni faiz dönemleri
 * (`faiz-oranlari.ts`), yıllık harç tarifeleri (`harc-tarifeleri.ts`).
 * Burada öyle bir tablo YOK ve olmayacak.
 *
 * Sebebi hukuki: değer kaybının aksine mahrumiyet bedeli için bağlayıcı
 * bir tarife, katsayı cetveli veya formül bulunmuyor. Dayanak doğrudan
 * haksız fiil hükümleri ve Yargıtay uygulaması. Günlük kira bedeli ise
 * piyasa verisi — segmente, sezona, şehre ve kiralama süresine göre
 * değişiyor. Kodda sabitlenirse bir sezon sonra sessizce yanlış olur.
 *
 * Bu yüzden bedeli kullanıcı topluyor (iki ayrı kiralama şirketinden) ve
 * bu dosya yalnızca çarpıyor. Bayatlayacak veri olmadığı için sekiz araç
 * içinde bakım yükü sıfır olan tek araç bu.
 *
 * ─── SONUÇ TEK SAYI DEĞİL, ARALIK ─────────────────────────────────────
 * İki teklif iki ayrı tutar üretir; ikisi de gösterilir. Tek bir rakam
 * vermek, piyasa verisine dayanan bir tahmini olduğundan daha kesin
 * gösterirdi. Ortalama kapanış satırı olarak veriliyor, ama aralık onun
 * hemen üstünde duruyor.
 *
 * ─── ARİTMETİK ────────────────────────────────────────────────────────
 * Kuruş tabanlı tam sayı çarpımı — § 3, § 4 ve § 6 ile aynı kural.
 * `3 × 1000.1` kayan noktada 3000.2999999999997 verir; kuruşta 300030
 * verir. Yuvarlama yalnızca ortalamada, bir kez yapılır.
 */

/** Gün sayısının üst sınırı. Bunun üstü kullanıcı hatasıdır (§ 5.5). */
export const EN_COK_GUN = 3650;

/**
 * Günlük kira bedelinin üst sınırı, TL.
 *
 * Makul bir tavan değil, taşma koruması: sınırsız bırakılırsa
 * `bedelKuruş × gün` çarpımı `Number.MAX_SAFE_INTEGER`ı aşıp sessizce
 * yanlış sonuç üretebilir. § 4'te bu sınır bir kez sorun olmuştu.
 * 1.000.000 TL × 100 kuruş × 3650 gün = 3,65 × 10¹¹ — güvenli aralıkta.
 */
export const EN_COK_GUNLUK_BEDEL = 1_000_000;

/** Aralık hesaplanabilmesi için gereken en az teklif sayısı. */
export const EN_AZ_TEKLIF = 2;

export interface MahrumiyetGirdi {
  /** Aracın onarımda/serviste kaldığı gün sayısı. */
  gun: number;
  /** Kullanıcının topladığı günlük kira teklifleri (TL). En az iki tane. */
  gunlukBedeller: readonly number[];
}

export interface TeklifTutari {
  /** Kuruşa yuvarlanmış günlük bedel — hesapta fiilen kullanılan değer. */
  gunlukBedel: number;
  /** gün × günlük bedel. */
  tutar: number;
}

export type MahrumiyetSonucu =
  | { durum: 'gecersiz-gun' }
  | { durum: 'gecersiz-bedel' }
  | { durum: 'yetersiz-teklif' }
  | {
      durum: 'hesaplandi';
      gun: number;
      /** Her teklifin kendi tutarı, girildiği sırayla. */
      tutarlar: readonly TeklifTutari[];
      /** En düşük teklifin verdiği tutar. */
      alt: number;
      /** En yüksek teklifin verdiği tutar. */
      ust: number;
      /** Tutarların aritmetik ortalaması. */
      ortalama: number;
    };

/**
 * Mahrumiyet bedeli tahmini.
 *
 * Hiçbir girdi tahmin edilmez: gün sayısı ya da bedel geçersizse hesap
 * yapılmaz, ilgili durum döner. Diğer araçlardaki "bilinmeyen için tahmin
 * yürütme" ilkesiyle aynı.
 */
export function mahrumiyetBedeliHesapla(girdi: MahrumiyetGirdi): MahrumiyetSonucu {
  const { gun, gunlukBedeller } = girdi;

  // Sıra bilinçli: gün önce kontrol edilir ki iki alan birden boşken
  // kullanıcıya hep aynı mesaj gösterilsin.
  if (!Number.isInteger(gun) || gun < 1 || gun > EN_COK_GUN) {
    return { durum: 'gecersiz-gun' };
  }

  if (gunlukBedeller.length < EN_AZ_TEKLIF) {
    return { durum: 'yetersiz-teklif' };
  }

  // Kuruşa çevirip ORADA doğrula: 0,004 TL gibi bir girdi kuruşa
  // yuvarlandığında sıfırlanır ve sessizce sıfır tutar üretirdi.
  const bedelKuruslar = gunlukBedeller.map((bedel) =>
    Number.isFinite(bedel) ? Math.round(bedel * 100) : Number.NaN
  );

  const gecersizBedel = bedelKuruslar.some(
    (kurus) => !Number.isFinite(kurus) || kurus <= 0 || kurus > EN_COK_GUNLUK_BEDEL * 100
  );
  if (gecersizBedel) {
    return { durum: 'gecersiz-bedel' };
  }

  const tutarKuruslar = bedelKuruslar.map((kurus) => kurus * gun);

  const toplamKurus = tutarKuruslar.reduce((toplam, kurus) => toplam + kurus, 0);
  const ortalamaKurus = Math.round(toplamKurus / tutarKuruslar.length);

  return {
    durum: 'hesaplandi',
    gun,
    tutarlar: bedelKuruslar.map((kurus, sira) => ({
      gunlukBedel: kurus / 100,
      tutar: tutarKuruslar[sira]! / 100,
    })),
    alt: Math.min(...tutarKuruslar) / 100,
    ust: Math.max(...tutarKuruslar) / 100,
    ortalama: ortalamaKurus / 100,
  };
}
