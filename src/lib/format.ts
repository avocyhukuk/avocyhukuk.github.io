/**
 * Türkçe biçimlendirme yardımcıları.
 *
 * Hesaplama araçlarının tamamı (Faz C) para ve tarih göstereceği için bu
 * fonksiyonlar tek yerde tutulur: TR biçiminde binlik ayracı NOKTA, ondalık
 * ayracı VİRGÜL'dür (1.234,56) — İngilizce biçimle karıştırılırsa hesap
 * sonucu müvekkile yanlış okunur.
 */

const LOCALE = 'tr-TR';

/**
 * Tutarı Türk Lirası olarak biçimlendirir. → "1.234,56 ₺"
 *
 * @param value Tutar. Sonlu bir sayı değilse (NaN/Infinity) hata fırlatır —
 *              hesaplama aracının ekrana "NaN ₺" yazmasındansa erken patlaması yeğdir.
 */
export function formatTRY(value: number): string {
  if (!Number.isFinite(value)) {
    throw new RangeError(`formatTRY sonlu bir sayı bekler, gelen: ${value}`);
  }

  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Sayıyı TR biçiminde gösterir. → formatNumber(1234.5, 1) === "1.234,5"
 *
 * @param value     Biçimlendirilecek sayı.
 * @param fractions Ondalık basamak sayısı (varsayılan 0).
 */
export function formatNumber(value: number, fractions = 0): string {
  if (!Number.isFinite(value)) {
    throw new RangeError(`formatNumber sonlu bir sayı bekler, gelen: ${value}`);
  }

  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: fractions,
    maximumFractionDigits: fractions,
  }).format(value);
}

/**
 * Yüzde değerini gösterir. → formatPercent(25.5) === "%25,5"
 * (TR yazımında yüzde işareti sayıdan ÖNCE gelir.)
 */
export function formatPercent(value: number, fractions = 2): string {
  return `%${formatNumber(value, fractions)}`;
}

/**
 * Tarihi uzun TR biçiminde gösterir. → "24 Ağustos 2026"
 * Blog yazılarında ve hesaplama sonuçlarında kullanılır.
 */
export function formatDateTR(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('formatDateTR geçerli bir Date bekler.');
  }

  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // Sunucuda (build sırasında) ve tarayıcıda aynı çıktı için sabitlenir;
    // aksi hâlde derleme yapan makinenin saat dilimine göre tarih kayabilir.
    timeZone: 'Europe/Istanbul',
  }).format(date);
}
