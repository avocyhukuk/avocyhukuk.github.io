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
 * ─── TEK TEKLİF DE YETER ──────────────────────────────────────────────
 * İki teklif iki ayrı tutar üretir; ikisi de gösterilir ve aralık ortaya
 * çıkar. Tek bir rakam vermek, piyasa verisine dayanan bir tahmini
 * olduğundan daha kesin gösterirdi — bu yüzden iki teklif ÖNERİLİYOR.
 *
 * Ama zorunlu değil: ikinci teklifi almak için siteyi terk etmek zorunda
 * kalan kullanıcı çoğu zaman geri dönmez. Tek teklifle de hesap yapılır,
 * yalnızca sonuç bir aralık değil tek tutar olur (`tutarlar.length === 1`)
 * ve arayüz ikinci teklifi önerir.
 *
 * Tek teklifte `alt`, `ust` ve `ortalama` aynı değere iner — çağıran taraf
 * bu durumda ARALIK GÖSTERMEMELİ, `tutarlar.length`e bakmalı.
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

/**
 * Hesap için gereken en az teklif sayısı.
 *
 * Bir. İki teklif daha iyi bir tahmin verir ama şart değildir; tek
 * teklifle hesap yapılır, sonuç aralık yerine tek tutar olur.
 */
export const EN_AZ_TEKLIF = 1;

export interface MahrumiyetGirdi {
  /** Aracın onarımda/serviste kaldığı gün sayısı. */
  gun: number;
  /**
   * Kullanıcının GİRDİĞİ günlük kira teklifleri (TL). En az bir tane.
   *
   * Boş bırakılan form alanları bu listeye hiç girmez — ayıklamayı
   * `teklifleriTopla` yapar. Listeye giren bir sıfır, boş alan değil
   * kullanıcının yazdığı sıfırdır ve geçersiz sayılır.
   */
  gunlukBedeller: readonly number[];
}

/**
 * Form alanlarının ham değerlerini teklif listesine çevirir.
 *
 * Neden `src/lib/` altında: "boş alan" ile "sıfır yazılmış alan" ayrımı
 * bu aracın davranışını belirleyen bir kural. Betiğin içinde kalsaydı test
 * edilemezdi; burada, "yalnızca ikinci alan dolu" gibi hâller Vitest ile
 * doğrulanabiliyor.
 *
 * - Boş veya yalnızca boşluk içeren alan ATLANIR.
 * - Diğer her değer sayıya çevrilip listeye girer; geçersizse hesap
 *   fonksiyonu reddeder (sessizce atılmaz).
 */
export function teklifleriTopla(hamDegerler: readonly string[]): number[] {
  return hamDegerler.filter((ham) => ham.trim() !== '').map(Number);
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
  /** Hiç teklif girilmemiş — iki alan da boş. */
  | { durum: 'yetersiz-teklif' }
  | {
      durum: 'hesaplandi';
      gun: number;
      /**
       * Her teklifin kendi tutarı, girildiği sırayla. Tek elemanlıysa
       * sonuç bir aralık değil, tek tutardır.
       */
      tutarlar: readonly TeklifTutari[];
      /** En düşük teklifin verdiği tutar. Tek teklifte `ust` ile aynıdır. */
      alt: number;
      /** En yüksek teklifin verdiği tutar. Tek teklifte `alt` ile aynıdır. */
      ust: number;
      /** Tutarların aritmetik ortalaması. Tek teklifte tutarın kendisidir. */
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
