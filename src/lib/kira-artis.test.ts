/**
 * docs/hesaplama-formulleri.md § 3.10'daki senaryoların birebir karşılığı.
 * Senaryo numaraları belgedeki numaralarla aynı; biri değişirse ikisi
 * birlikte güncellenmeli.
 */
import { describe, expect, it } from 'vitest';
import { kiraArtisiHesapla } from './kira-artis';
import { ayAdi, oranBul, oranliAylar } from './tufe';

const EYLUL = '2026-09';

describe('kiraArtisiHesapla', () => {
  it('senaryo 1 — onaylanmış temel hesap (10.000 TL, %31,79)', () => {
    const sonuc = kiraArtisiHesapla({ mevcutKira: 10_000, yenilemeAyi: EYLUL });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.tavanOrani).toBe(31.79);
    expect(sonuc.azamiArtis).toBe(3179);
    expect(sonuc.azamiBedel).toBe(13_179);
    // Sözleşme oranı verilmediğinde uygulanacak olan tavandır
    expect(sonuc.uygulanacakBedel).toBe(13_179);
    expect(sonuc.sozlesmeOrani).toBeUndefined();
    expect(sonuc.sozlesmeTavaniAsiyor).toBeUndefined();
  });

  it('senaryo 2 — küsurat korunuyor, tam liraya yuvarlanmıyor', () => {
    const sonuc = kiraArtisiHesapla({ mevcutKira: 27_500, yenilemeAyi: EYLUL });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    // 27.500 × 31,79 / 100 = 8.742,25 — kayan noktada 8742,249999… çıkıyor,
    // kuruş tabanlı hesap bunu düzeltiyor.
    expect(sonuc.azamiArtis).toBe(8742.25);
    expect(sonuc.azamiBedel).toBe(36_242.25);
  });

  it('senaryo 3 — sözleşme oranı tavanın altında, sözleşme uygulanır', () => {
    const sonuc = kiraArtisiHesapla({
      mevcutKira: 10_000,
      yenilemeAyi: EYLUL,
      sozlesmeOrani: 20,
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.sozlesmeTavaniAsiyor).toBe(false);
    expect(sonuc.uygulanacakOran).toBe(20);
    expect(sonuc.uygulanacakBedel).toBe(12_000);
    // Tavan yine de bilgi olarak duruyor
    expect(sonuc.azamiBedel).toBe(13_179);
  });

  it('senaryo 4 — sözleşme oranı tavanı aşıyor, tavan uygulanır', () => {
    const sonuc = kiraArtisiHesapla({
      mevcutKira: 10_000,
      yenilemeAyi: EYLUL,
      sozlesmeOrani: 45,
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.sozlesmeTavaniAsiyor).toBe(true);
    expect(sonuc.uygulanacakOran).toBe(31.79);
    expect(sonuc.uygulanacakBedel).toBe(13_179);
  });

  it('senaryo 5 — sözleşme oranı tavana tam eşit', () => {
    const sonuc = kiraArtisiHesapla({
      mevcutKira: 10_000,
      yenilemeAyi: EYLUL,
      sozlesmeOrani: 31.79,
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    // Eşitlik "aşma" sayılmaz
    expect(sonuc.sozlesmeTavaniAsiyor).toBe(false);
    expect(sonuc.uygulanacakBedel).toBe(13_179);
  });

  it('senaryo 6 — tabloda olmayan ay: hesap yapılmaz', () => {
    const sonuc = kiraArtisiHesapla({ mevcutKira: 10_000, yenilemeAyi: '2027-04' });

    expect(sonuc).toEqual({ durum: 'oran-bulunamadi', yenilemeAyi: '2027-04' });
  });

  it('senaryo 7 — %25 tavanı dönemi kapsam dışı: oran yok, hesap yok', () => {
    // Geçmiş dönem tabloya hiç girilmediği için bu ay da "oran yok" dalına
    // düşüyor. Ayrı bir kapsam kontrolü gerekmiyor.
    const sonuc = kiraArtisiHesapla({ mevcutKira: 10_000, yenilemeAyi: '2023-01' });

    expect(sonuc).toEqual({ durum: 'oran-bulunamadi', yenilemeAyi: '2023-01' });
  });

  it('senaryo 8 — geçersiz kira bedeli', () => {
    expect(kiraArtisiHesapla({ mevcutKira: 0, yenilemeAyi: EYLUL })).toEqual({
      durum: 'gecersiz-kira',
    });
    expect(kiraArtisiHesapla({ mevcutKira: -100, yenilemeAyi: EYLUL })).toEqual({
      durum: 'gecersiz-kira',
    });
    expect(kiraArtisiHesapla({ mevcutKira: Number.NaN, yenilemeAyi: EYLUL })).toEqual({
      durum: 'gecersiz-kira',
    });
  });

  it('negatif sözleşme oranı reddedilir', () => {
    expect(
      kiraArtisiHesapla({ mevcutKira: 10_000, yenilemeAyi: EYLUL, sozlesmeOrani: -5 })
    ).toEqual({ durum: 'gecersiz-oran' });
  });

  it('sözleşme oranı sıfır olabilir — artış yapılmaması geçerli bir anlaşmadır', () => {
    const sonuc = kiraArtisiHesapla({
      mevcutKira: 10_000,
      yenilemeAyi: EYLUL,
      sozlesmeOrani: 0,
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.uygulanacakArtis).toBe(0);
    expect(sonuc.uygulanacakBedel).toBe(10_000);
  });

  it('kuruşlu kira bedeli bozulmadan işlenir', () => {
    const sonuc = kiraArtisiHesapla({ mevcutKira: 1234.56, yenilemeAyi: EYLUL });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    // 1234,56 × 31,79 / 100 = 392,466... → kuruşa yuvarlanır
    expect(sonuc.azamiArtis).toBe(392.47);
    expect(sonuc.azamiBedel).toBe(1627.03);
  });
});

describe('tufe tablosu', () => {
  it('onaylanmış Eylül 2026 kaydı tabloda ve doğru', () => {
    const kayit = oranBul('2026-09');

    expect(kayit).toBeDefined();
    expect(kayit?.oran).toBe(31.79);
    // Oran, bir önceki ayın bülteninden geliyor
    expect(kayit?.kaynakBulten).toBe('2026-08');
  });

  it('oranliAylar en yeniden eskiye sıralar', () => {
    const aylar = oranliAylar().map((k) => k.yenilemeAyi);
    const sirali = [...aylar].sort((a, b) => b.localeCompare(a));

    expect(aylar).toEqual(sirali);
  });

  it('ayAdi TR ay adına çevirir', () => {
    expect(ayAdi('2026-09')).toBe('Eylül 2026');
    expect(ayAdi('2026-01')).toBe('Ocak 2026');
    expect(ayAdi('2026-12')).toBe('Aralık 2026');
  });

  it('ayAdi geçersiz girdide olduğu gibi döner', () => {
    expect(ayAdi('bozuk')).toBe('bozuk');
    expect(ayAdi('2026-99')).toBe('2026-99');
  });
});
