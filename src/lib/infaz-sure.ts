/**
 * İnfaz hesabının süre aritmetiği.
 *
 * Gerekçe ve kararlar: docs/hesaplama-formulleri.md § 1.15/Karar 2.
 *
 * ─── NEDEN AYRI BİR MODÜL ─────────────────────────────────────────────
 * İnfaz süreleri para gibi davranmıyor. İki farklı konvansiyon aynı anda
 * geçerli ve birbirine denk değil:
 *
 *   · Oran uygulanırken   → 1 yıl = 12 ay, 1 ay = 30 gün
 *   · Takvime çevrilirken → 1 yıl = 365 gün, 1 ay = 30 gün
 *
 * 12 × 30 = 360 ≠ 365. Yani "önce oranla sonra güne çevir" ile "önce
 * güne çevir sonra oranla" FARKLI sonuç veriyor (18 yıllık bir cezada
 * 5 gün). Müddetname uygulaması yıl-ay-gün birimiyle çalıştığı için
 * **birincisi** seçildi.
 *
 * Bu ayrımı tek bir yerde tutmak, aracın geri kalanının yanlışlıkla
 * gün üzerinden oran uygulamasını engelliyor.
 *
 * ─── BİRİM ────────────────────────────────────────────────────────────
 * İç hesap `birim` üzerinden yapılıyor: **30 günlük aylardaki gün
 * sayısı.** 1 yıl = 360 birim, 1 ay = 30 birim, 1 gün = 1 birim.
 * Tam sayı olduğu için kesir kaybı yok — kuruş aritmetiğiyle aynı fikir.
 */

export interface Sure {
  yil: number;
  ay: number;
  gun: number;
}

/** Ay başına gün — oran uygulanırken kullanılan konvansiyon. */
export const AY_GUN = 30;
/** Yıl başına ay. */
export const YIL_AY = 12;
/** Bir yılın birim karşılığı: 12 × 30. */
export const YIL_BIRIM = YIL_AY * AY_GUN;
/** Takvime çevirirken bir yılın gün karşılığı. 360 DEĞİL. */
export const YIL_TAKVIM_GUN = 365;

export const SIFIR_SURE: Sure = { yil: 0, ay: 0, gun: 0 };

/** Süreyi iç birime çevirir. */
export function birime(sure: Sure): number {
  return sure.yil * YIL_BIRIM + sure.ay * AY_GUN + sure.gun;
}

/** Gün sayısını iç birime çevirir — mahsup gibi doğrudan gün gelen değerler için. */
export function gunBirime(gun: number): number {
  return gun;
}

/** İç birimi yıl-ay-gün olarak ayrıştırır. */
export function sureye(birim: number): Sure {
  const toplam = Math.max(0, Math.round(birim));
  const yil = Math.floor(toplam / YIL_BIRIM);
  const kalan = toplam - yil * YIL_BIRIM;
  return { yil, ay: Math.floor(kalan / AY_GUN), gun: kalan % AY_GUN };
}

/**
 * İç birimi TAKVİM gününe çevirir.
 *
 * Burada 1 yıl = 365; oran uygularken kullanılan 360 değil. İki
 * konvansiyonun ayrıldığı tek nokta burası.
 */
export function takvimGunu(birim: number): number {
  const { yil, ay, gun } = sureye(birim);
  return yil * YIL_TAKVIM_GUN + ay * AY_GUN + gun;
}

/**
 * Süreye oran uygular. Sonuç tam güne yuvarlanır.
 *
 * Yuvarlama, § 1.13/5'teki "küsurat yuvarlaması yapma" kararıyla
 * çelişmiyor: orada kastedilen ay/yıl küsuratıydı. Birim zaten gün
 * olduğu için burada yarım gün üretmemek gerekiyor; 2/3 ve 1/2
 * oranlarında fikstürün tamamı zaten tam bölünüyor.
 */
export function oranla(birim: number, pay: number, payda: number): number {
  return Math.round((birim * pay) / payda);
}

/** İki sürenin farkı, birim cinsinden. Negatif olabilir. */
export function fark(a: number, b: number): number {
  return a - b;
}

/** "2 yıl 6 ay" · "3 ay 15 gün" · sıfırsa "0 gün". */
export function sureYaz(sure: Sure): string {
  const parcalar: string[] = [];
  if (sure.yil) parcalar.push(`${sure.yil} yıl`);
  if (sure.ay) parcalar.push(`${sure.ay} ay`);
  if (sure.gun) parcalar.push(`${sure.gun} gün`);
  return parcalar.length > 0 ? parcalar.join(' ') : '0 gün';
}

/** Birimi doğrudan okunur metne çevirir. */
export function birimYaz(birim: number): string {
  return sureYaz(sureye(birim));
}

/** Tarihe gün ekler. UTC — yaz saati geçişinde gün kaymasın. */
export function gunEkle(tarih: Date, gun: number): Date {
  return new Date(tarih.getTime() + gun * 86_400_000);
}

/** Tarihi günün başına çeker. */
export function guneYuvarla(tarih: Date): Date {
  return new Date(Date.UTC(tarih.getUTCFullYear(), tarih.getUTCMonth(), tarih.getUTCDate()));
}
