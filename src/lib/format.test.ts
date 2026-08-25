import { describe, expect, it } from 'vitest';
import { formatDateTR, formatNumber, formatPercent, formatTRY } from './format';

describe('formatTRY', () => {
  it('TR biçiminde binlik nokta, ondalık virgül kullanır', () => {
    // İngilizce biçimle (1,234.56) karışırsa müvekkile yanlış tutar gösterilir.
    expect(formatTRY(1234.56)).toBe('₺1.234,56');
  });

  it('ondalığı daima iki basamağa tamamlar', () => {
    expect(formatTRY(1000)).toBe('₺1.000,00');
  });

  it('negatif tutarı işaretiyle gösterir (borç/alacak farkı)', () => {
    expect(formatTRY(-250.5)).toBe('-₺250,50');
  });

  it('sonlu olmayan değerde hata fırlatır', () => {
    // Ekrana "NaN ₺" yazmaktansa erken patlaması yeğdir.
    expect(() => formatTRY(Number.NaN)).toThrow(RangeError);
    expect(() => formatTRY(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe('formatNumber', () => {
  it('varsayılan olarak ondalıksız yuvarlar', () => {
    expect(formatNumber(1234.5)).toBe('1.235');
  });

  it('istenen ondalık basamağı korur', () => {
    expect(formatNumber(1234.5, 1)).toBe('1.234,5');
  });

  it('sonlu olmayan değerde hata fırlatır', () => {
    expect(() => formatNumber(Number.NaN)).toThrow(RangeError);
  });
});

describe('formatPercent', () => {
  it('yüzde işaretini TR yazımına uygun olarak sayıdan önce koyar', () => {
    expect(formatPercent(25.5, 1)).toBe('%25,5');
  });
});

describe('formatDateTR', () => {
  it('uzun TR biçiminde tarih üretir', () => {
    expect(formatDateTR(new Date('2026-08-24T12:00:00Z'))).toBe('24 Ağustos 2026');
  });

  it('saat dilimi Europe/Istanbul sabitlendiği için gün kaymaz', () => {
    // UTC 21:30 = TR 00:30 (ertesi gün). Sabitlenmeseydi derlemeyi yapan
    // makinenin saat dilimine göre farklı tarih basılırdı.
    expect(formatDateTR(new Date('2026-08-24T21:30:00Z'))).toBe('25 Ağustos 2026');
  });

  it('geçersiz tarihte hata fırlatır', () => {
    expect(() => formatDateTR(new Date('gecersiz'))).toThrow(RangeError);
  });
});
