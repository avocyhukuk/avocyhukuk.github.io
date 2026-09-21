/**
 * docs/hesaplama-formulleri.md § 8 — marka tescil süreç takvimi.
 *
 * Beklenen tarihler bağımsız bir takvim hesabıyla doğrulandı; elle
 * yazılmadı. Testlerin ağırlığı takvim aritmetiğinde: ay eklemenin ayın
 * sonuna kırpılması ve artık yıl.
 */
import { describe, expect, it } from 'vitest';
import { markaTakvimiHesapla, type MarkaTakvimiSonucu } from './marka-takvimi';
import { ASAMALAR, ITIRAZLI_SURE, SMK_YURURLUK } from './marka-asamalari';

function hesap(sonuc: MarkaTakvimiSonucu) {
  if (sonuc.durum !== 'hesaplandi') throw new Error(`beklenmeyen durum: ${sonuc.durum}`);
  return sonuc;
}

/** Karşılaştırmayı okunur kılar — saat/zaman dilimi gürültüsü olmadan. */
const gun = (tarih: Date) => tarih.toISOString().slice(0, 10);

const utc = (yil: number, ay: number, g: number) => new Date(Date.UTC(yil, ay - 1, g));

describe('takvim — belgedeki senaryolar', () => {
  it('senaryo 1 — 15.01.2026 başvurusu', () => {
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 15)));

    expect(s.asamalar.map((a) => [gun(a.enErken), gun(a.enGec)])).toEqual([
      ['2026-01-29', '2026-05-15'],
      ['2026-02-28', '2026-10-15'],
      ['2026-04-28', '2026-12-15'],
      ['2026-05-12', '2027-02-15'],
    ]);

    // İtirazsız sonuç = son aşamanın tarihleri.
    expect(gun(s.itirazsiz.enErken)).toBe('2026-05-12');
    expect(gun(s.itirazsiz.enGec)).toBe('2027-02-15');
  });

  it('senaryo 1b — aynı başvuruda itirazlı dal', () => {
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 15)));

    // Başvuru + 12 ay ve + 18 ay; aşamalardan bağımsız.
    expect(gun(s.itirazli.enErken)).toBe('2027-01-15');
    expect(gun(s.itirazli.enGec)).toBe('2027-07-15');
  });

  it('senaryo 2 — ay sonu TAŞMIYOR, kırpılıyor', () => {
    // 31.01.2026 + 1 ay = 28.02.2026 olmalı; JavaScript'in ham davranışı
    // 03.03.2026 verirdi. Kırpma son aşamada da görünüyor:
    // 31.12.2026 + 2 ay = 28.02.2027.
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 31)));

    expect(s.asamalar.map((a) => [gun(a.enErken), gun(a.enGec)])).toEqual([
      ['2026-02-14', '2026-05-31'],
      ['2026-03-14', '2026-10-31'],
      ['2026-05-14', '2026-12-31'],
      ['2026-05-28', '2027-02-28'],
    ]);
  });

  it('senaryo 3 — artık yıl', () => {
    // 29.02.2028 + 12 ay → 2029 Şubat 28 çektiği için 28.02.2029.
    expect(gun(hesap(markaTakvimiHesapla(utc(2028, 2, 29))).itirazli.enErken)).toBe('2029-02-28');

    // 31.08.2026 + 18 ay → 2028 artık yıl, 29.02.2028.
    expect(gun(hesap(markaTakvimiHesapla(utc(2026, 8, 31))).itirazli.enGec)).toBe('2028-02-29');

    // Aynı gün, artık olmayan yıla düşerse 28'e kırpılır.
    expect(gun(hesap(markaTakvimiHesapla(utc(2025, 8, 31))).itirazli.enGec)).toBe('2027-02-28');
  });

  it('senaryo 5-6 — SMK yürürlük sınırı', () => {
    const oncesi = markaTakvimiHesapla(utc(2017, 1, 9));
    expect(oncesi.durum).toBe('smk-oncesi');
    if (oncesi.durum === 'smk-oncesi') {
      expect(gun(oncesi.yururluk)).toBe('2017-01-10');
    }

    // Tam sınır kabul edilir.
    expect(hesap(markaTakvimiHesapla(utc(2017, 1, 10))).durum).toBe('hesaplandi');
  });

  it('senaryo 7 — geçersiz tarih', () => {
    expect(markaTakvimiHesapla(new Date('olmayan-tarih'))).toEqual({ durum: 'gecersiz-tarih' });
    expect(markaTakvimiHesapla(new Date(Number.NaN))).toEqual({ durum: 'gecersiz-tarih' });
  });

  it('senaryo 8 — yayım aşaması KESİN ve tam iki ay', () => {
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 15)));
    const yayim = s.asamalar[2]!;
    const onceki = s.asamalar[1]!;

    expect(yayim.kesin).toBe(true);
    expect(yayim.dayanak.short).toBe('SMK m.18/1');

    // Hem min hem max yolda tam iki ay eklenmiş — kanuni süre, tahmin değil.
    expect(gun(yayim.enErken)).toBe('2026-04-28');
    expect(gun(onceki.enErken)).toBe('2026-02-28');
    expect(gun(yayim.enGec)).toBe('2026-12-15');
    expect(gun(onceki.enGec)).toBe('2026-10-15');
  });
});

describe('takvim yapısı', () => {
  it('yalnızca yayım aşaması kesin', () => {
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 15)));
    expect(s.asamalar.filter((a) => a.kesin)).toHaveLength(1);
  });

  it('tarihler geriye gitmiyor ve en erken ≤ en geç', () => {
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 15)));
    let oncekiErken = s.basvuru.getTime();
    let oncekiGec = s.basvuru.getTime();

    for (const asama of s.asamalar) {
      expect(asama.enErken.getTime()).toBeGreaterThan(oncekiErken);
      expect(asama.enGec.getTime()).toBeGreaterThan(oncekiGec);
      expect(asama.enErken.getTime()).toBeLessThanOrEqual(asama.enGec.getTime());
      oncekiErken = asama.enErken.getTime();
      oncekiGec = asama.enGec.getTime();
    }
  });

  it('saat bilgisi sonucu kirletmiyor', () => {
    // Form `yyyy-mm-dd` veriyor ama çağıran başka bir yerden saatli bir
    // Date geçirebilir; sonuç gün başına çekilmeli.
    const s = hesap(markaTakvimiHesapla(new Date('2026-01-15T23:45:00Z')));
    expect(gun(s.basvuru)).toBe('2026-01-15');
    expect(s.basvuru.getUTCHours()).toBe(0);
  });

  it('girdi Date nesnesi DEĞİŞTİRİLMİYOR', () => {
    const girdi = utc(2026, 1, 15);
    const kopya = girdi.getTime();
    markaTakvimiHesapla(girdi);
    expect(girdi.getTime()).toBe(kopya);
  });

  it('her aşamanın dayanağı var', () => {
    const s = hesap(markaTakvimiHesapla(utc(2026, 1, 15)));
    for (const asama of s.asamalar) {
      expect(asama.dayanak.short).toMatch(/^SMK m\./);
      expect(asama.dayanak.full.length).toBeGreaterThan(20);
    }
  });
});

describe('aşama tablosu', () => {
  it('dört aşama, sırası sabit', () => {
    expect(ASAMALAR.map((a) => a.ad)).toEqual([
      'Başvuru ve şekli inceleme',
      'Mutlak ret nedenleri incelemesi',
      'Bültende yayım ve itiraz süresi',
      'Tescil ve belge düzenlenmesi',
    ]);
  });

  it('yayım süresi iki ay — SMK m. 18/1', () => {
    const yayim = ASAMALAR[2]!;
    expect(yayim.min).toEqual({ deger: 2, birim: 'ay' });
    expect(yayim.max).toEqual({ deger: 2, birim: 'ay' });
    expect(yayim.kesin).toBe(true);
  });

  it('itirazlı aralık 12-18 ay', () => {
    expect(ITIRAZLI_SURE.min).toEqual({ deger: 12, birim: 'ay' });
    expect(ITIRAZLI_SURE.max).toEqual({ deger: 18, birim: 'ay' });
  });

  it('her aşamada min ≤ max', () => {
    const ayaCevir = (s: { deger: number; birim: string }) =>
      s.birim === 'ay' ? s.deger : s.deger / 4;

    for (const asama of ASAMALAR) {
      expect(ayaCevir(asama.min), asama.ad).toBeLessThanOrEqual(ayaCevir(asama.max));
    }
  });

  it('SMK yürürlük tarihi 10 Ocak 2017', () => {
    expect(new Date(SMK_YURURLUK).toISOString().slice(0, 10)).toBe('2017-01-10');
  });
});
