/**
 * docs/hesaplama-formulleri.md § 4 — gecikme faizi.
 *
 * Ana fikstür 4.4'teki doğrulanmış örnek hesap. Diğer testler onaylanan
 * üç sayım kuralını (365 payda, sınır günü eski döneme, dilim başına
 * yuvarlama) ve anatosizm yasağını ayrı ayrı zorluyor.
 */
import { describe, expect, it } from 'vitest';
import { gecikmeFaiziHesapla } from './gecikme-faizi';
import { KANUNI_FAIZ_DONEMLERI } from './faiz-oranlari';

describe('gecikmeFaiziHesapla — kanuni faiz', () => {
  it('üç oranı kesen aralık — belgedeki doğrulanmış örnek', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 100_000,
      baslangic: '2024-01-01',
      bitis: '2026-10-01',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.dilimler).toHaveLength(3);
    expect(sonuc.dilimler.map((d) => [d.gun, d.oran, d.faiz])).toEqual([
      [151, 9, 3723.29],
      [790, 24, 51_945.21],
      [63, 31, 5350.68],
    ]);

    expect(sonuc.toplamGun).toBe(1004);
    expect(sonuc.toplamFaiz).toBe(61_019.18);
    expect(sonuc.toplamBorc).toBe(161_019.18);
  });

  it('dilim günleri, aralığın toplam gününe eşit — sınır günü ne çift sayılır ne düşer', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 50_000,
      baslangic: '2023-03-15',
      bitis: '2026-09-14',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    // 2023-03-15 → 2026-09-14 arası gün sayısı
    const beklenenGun = (Date.UTC(2026, 8, 14) - Date.UTC(2023, 2, 15)) / 86_400_000;
    expect(sonuc.toplamGun).toBe(beklenenGun);
  });

  it('dilim faizlerinin toplamı, gösterilen toplama eşit', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 33_333.33,
      baslangic: '2024-02-29',
      bitis: '2026-08-15',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    const elleToplam = sonuc.dilimler.reduce((t, d) => t + d.faiz, 0);
    expect(sonuc.toplamFaiz).toBe(Math.round(elleToplam * 100) / 100);
  });

  it('tek dönem içinde kalan aralık tek dilim üretir', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 10_000,
      baslangic: '2025-01-01',
      bitis: '2025-12-31',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.dilimler).toHaveLength(1);
    expect(sonuc.dilimler[0]!.oran).toBe(24);
    expect(sonuc.dilimler[0]!.gun).toBe(364);
    // 10.000 × 24% × 364/365
    expect(sonuc.dilimler[0]!.faiz).toBe(2393.42);
  });

  it('sınır gününe tam denk gelen bitiş — gün eski döneme yazılır', () => {
    // %9 dönemi 31.05.2024'te bitiyor. Bitiş tam o gün olursa tek dilim
    // çıkmalı ve oran %9 olmalı; %24 dilimi hiç açılmamalı.
    const sonuc = gecikmeFaiziHesapla({
      anapara: 10_000,
      baslangic: '2024-05-01',
      bitis: '2024-05-31',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.dilimler).toHaveLength(1);
    expect(sonuc.dilimler[0]!.oran).toBe(9);
    expect(sonuc.dilimler[0]!.gun).toBe(30);
  });

  it('sınır gününün ertesinde başlayan aralık yeni oranı kullanır', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 10_000,
      baslangic: '2024-05-31',
      bitis: '2024-06-30',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.dilimler).toHaveLength(1);
    expect(sonuc.dilimler[0]!.oran).toBe(24);
    expect(sonuc.dilimler[0]!.gun).toBe(30);
  });

  it('artık yılda da payda 365 — 366 kullanılmıyor', () => {
    // 2024 artık yıl. 01.06.2024 – 01.06.2025 arası 365 gün.
    const sonuc = gecikmeFaiziHesapla({
      anapara: 100_000,
      baslangic: '2024-06-01',
      bitis: '2025-06-01',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.toplamGun).toBe(365);
    // Tam bir yıl → faiz tam olarak yıllık oran kadar
    expect(sonuc.toplamFaiz).toBe(24_000);
  });

  it('anatosizm: faiz her dilimde ANAPARA üzerinden işler', () => {
    // Bileşik olsaydı ikinci dilim, birinci dilimin faizini de kapsardı.
    const sonuc = gecikmeFaiziHesapla({
      anapara: 100_000,
      baslangic: '2024-01-01',
      bitis: '2026-10-01',
      tur: 'kanuni',
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    for (const dilim of sonuc.dilimler) {
      const beklenen = Math.round(100_000 * (dilim.oran / 100) * (dilim.gun / 365) * 100) / 100;
      expect(dilim.faiz, `${dilim.oran}% dilimi`).toBeCloseTo(beklenen, 2);
    }
  });
});

describe('gecikmeFaiziHesapla — sözleşmesel oran', () => {
  it('tek dilim, verilen oranla', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 100_000,
      baslangic: '2024-01-01',
      bitis: '2026-10-01',
      tur: 'sozlesmesel',
      sozlesmeOrani: 15,
    });

    expect(sonuc.durum).toBe('hesaplandi');
    if (sonuc.durum !== 'hesaplandi') return;

    expect(sonuc.dilimler).toHaveLength(1);
    expect(sonuc.dilimler[0]!.oran).toBe(15);
    expect(sonuc.toplamGun).toBe(1004);
    // 100.000 × 15% × 1004/365
    expect(sonuc.toplamFaiz).toBe(41_260.27);
  });

  it('sözleşmesel oran 2006 öncesi tarihte de çalışır — tablo kısıtı yok', () => {
    const sonuc = gecikmeFaiziHesapla({
      anapara: 10_000,
      baslangic: '1999-01-01',
      bitis: '2000-01-01',
      tur: 'sozlesmesel',
      sozlesmeOrani: 10,
    });

    expect(sonuc.durum).toBe('hesaplandi');
  });

  it('oran verilmezse reddedilir', () => {
    expect(
      gecikmeFaiziHesapla({
        anapara: 10_000,
        baslangic: '2025-01-01',
        bitis: '2025-06-01',
        tur: 'sozlesmesel',
      })
    ).toEqual({ durum: 'gecersiz-oran' });
  });
});

describe('gecikmeFaiziHesapla — girdi doğrulama', () => {
  const temel = { baslangic: '2025-01-01', bitis: '2025-06-01', tur: 'kanuni' } as const;

  it('anapara sıfır veya negatif olamaz', () => {
    expect(gecikmeFaiziHesapla({ ...temel, anapara: 0 })).toEqual({
      durum: 'gecersiz-anapara',
    });
    expect(gecikmeFaiziHesapla({ ...temel, anapara: -1 })).toEqual({
      durum: 'gecersiz-anapara',
    });
  });

  it('bitiş, başlangıçtan sonra olmalı', () => {
    expect(
      gecikmeFaiziHesapla({
        anapara: 10_000,
        baslangic: '2025-06-01',
        bitis: '2025-01-01',
        tur: 'kanuni',
      })
    ).toEqual({ durum: 'gecersiz-tarih' });

    expect(
      gecikmeFaiziHesapla({
        anapara: 10_000,
        baslangic: '2025-01-01',
        bitis: '2025-01-01',
        tur: 'kanuni',
      })
    ).toEqual({ durum: 'gecersiz-tarih' });
  });

  it('var olmayan tarih reddedilir', () => {
    expect(
      gecikmeFaiziHesapla({
        anapara: 10_000,
        baslangic: '2025-04-31',
        bitis: '2025-06-01',
        tur: 'kanuni',
      })
    ).toEqual({ durum: 'gecersiz-tarih' });

    expect(
      gecikmeFaiziHesapla({
        anapara: 10_000,
        baslangic: '2023-02-29',
        bitis: '2025-06-01',
        tur: 'kanuni',
      })
    ).toEqual({ durum: 'gecersiz-tarih' });
  });

  it('kanuni faizde 2006 öncesi kapsam dışı', () => {
    expect(
      gecikmeFaiziHesapla({
        anapara: 10_000,
        baslangic: '2005-12-31',
        bitis: '2010-01-01',
        tur: 'kanuni',
      })
    ).toEqual({ durum: 'kapsam-disi-tarih', enErken: '2006-01-01' });
  });
});

describe('kanuni faiz oran tablosu', () => {
  it('dönemler eskiden yeniye sıralı ve yalnız sonuncusu açık uçlu', () => {
    const sonlar = KANUNI_FAIZ_DONEMLERI.map((d) => d.son);

    expect(sonlar.slice(0, -1).every((s) => s !== null)).toBe(true);
    expect(sonlar.at(-1)).toBeNull();

    const kapalilar = sonlar.filter((s): s is string => s !== null);
    expect(kapalilar).toEqual([...kapalilar].sort());
  });

  it('belgedeki oranlarla birebir', () => {
    expect(KANUNI_FAIZ_DONEMLERI.map((d) => [d.son, d.oran])).toEqual([
      ['2024-05-31', 9],
      ['2026-07-30', 24],
      [null, 31],
    ]);
  });
});
