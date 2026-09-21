/**
 * docs/hesaplama-formulleri.md § 7 — limited şirket kuruluş maliyeti.
 *
 * Çekirdek fikstürler § 7.9'daki yedi senaryo. Kalan testler kalem
 * listesini, bayatlama korumasını ve kuruş aritmetiğini zorluyor.
 */
import { describe, expect, it } from 'vitest';
import {
  EN_COK_KELIME,
  EN_COK_SERMAYE,
  kurulusMaliyetiHesapla,
  type KurulusSonucu,
} from './kurulus-maliyeti';
import {
  KURULUS_TARIFELERI,
  LIMITED_ASGARI_SERMAYE,
  REKABET_PAYI_PAY,
  REKABET_PAYI_PAYDA,
  tarifeBul,
  tarifeliYillar,
} from './kurulus-tarifeleri';

function hesap(sonuc: KurulusSonucu) {
  if (sonuc.durum !== 'hesaplandi') throw new Error(`beklenmeyen durum: ${sonuc.durum}`);
  return sonuc;
}

const kalem = (s: ReturnType<typeof hesap>, ad: string) => s.kalemler.find((k) => k.ad === ad);

describe('kuruluş maliyeti — belgedeki senaryolar', () => {
  it('senaryo 1 — 50.000 TL sermaye, 1.500 kelime, 2026', () => {
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }));

    expect(kalem(s, 'Oda kayıt ücreti')?.tutar).toBe(3900);
    expect(kalem(s, 'Beyanname ücreti')?.tutar).toBe(250);
    expect(kalem(s, 'Defter ve kuruluş tasdik ücreti')?.tutar).toBe(2500);
    // 1.500 × 2,48
    expect(kalem(s, 'Ticaret Sicili Gazetesi ilan ücreti')?.tutar).toBe(3720);
    // 50.000 × 4 / 10.000
    expect(kalem(s, 'Rekabet Kurumu payı')?.tutar).toBe(20);

    expect(s.toplam).toBe(10_390);
  });

  it('senaryo 2 — 250.000 TL sermaye, 2.000 kelime, 2026', () => {
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 250_000, kelimeSayisi: 2000 }));

    expect(kalem(s, 'Ticaret Sicili Gazetesi ilan ücreti')?.tutar).toBe(4960);
    expect(kalem(s, 'Rekabet Kurumu payı')?.tutar).toBe(100);
    expect(s.toplam).toBe(11_710);
  });

  it('senaryo 3 — asgari sermayenin altı reddedilir', () => {
    expect(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 49_999, kelimeSayisi: 1500 })).toEqual({
      durum: 'gecersiz-sermaye',
      asgari: LIMITED_ASGARI_SERMAYE,
    });

    // Tam sınır kabul edilir.
    expect(
      hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })).toplam
    ).toBe(10_390);
  });

  it('senaryo 4 — geçersiz kelime sayısı', () => {
    for (const kelimeSayisi of [0, -10, 12.5, Number.NaN, EN_COK_KELIME + 1]) {
      expect(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi })).toEqual({
        durum: 'gecersiz-kelime',
      });
    }
  });

  it('senaryo 5 — tarifesi olmayan yılda hesap yapılmaz', () => {
    expect(kurulusMaliyetiHesapla({ yil: 2027, sermaye: 50_000, kelimeSayisi: 1500 })).toEqual({
      durum: 'tarife-yok',
      yil: 2027,
    });
  });

  it('senaryo 6 — tescil harcı satırı 0,00 ve toplama girmiyor', () => {
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }));
    const harc = kalem(s, 'Ticaret sicili tescil harcı');

    expect(harc?.tutar).toBe(0);
    expect(harc?.bilgi).toBe(true);
    expect(harc?.dayanak?.short).toBe('492 m.123');
    // Satır listede DURUYOR — gizlenmiyor.
    expect(s.kalemler[0]?.ad).toBe('Ticaret sicili tescil harcı');
    expect(s.toplam).toBe(10_390);
  });

  it('senaryo 7 — kuruş artığı yok', () => {
    // 0,0004 ile doğrudan çarpım 12.345,67 × 0,0004 = 4.938268e0 gibi
    // artıklar üretiyordu; kesirle bölmede üretmiyor.
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 123_456.78, kelimeSayisi: 1337 }));
    const pay = kalem(s, 'Rekabet Kurumu payı')!.tutar;

    // 12.345.678 kuruş × 4 / 10.000 = 4.938,27... → 4.938 kuruş
    expect(pay).toBe(49.38);
    expect(Number.isInteger(Math.round(pay * 100))).toBe(true);
    // Toplam da kuruşta kalmalı — iki ondalıktan fazlası olmamalı.
    expect(s.toplam).toBe(Math.round(s.toplam * 100) / 100);
  });
});

describe('kalem listesi', () => {
  it('altı kalem, sırası sabit', () => {
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }));

    expect(s.kalemler.map((k) => k.ad)).toEqual([
      'Ticaret sicili tescil harcı',
      'Oda kayıt ücreti',
      'Beyanname ücreti',
      'Defter ve kuruluş tasdik ücreti',
      'Ticaret Sicili Gazetesi ilan ücreti',
      'Rekabet Kurumu payı',
    ]);
  });

  it('noter, mali müşavir ve e-imza kalem olarak YOK', () => {
    // Üçü de resmî tarifeye bağlı olmadığı için hesapta yer almıyor;
    // sonuç ekranında not olarak söyleniyorlar. Kalem olarak eklenirlerse
    // bu test kırılır ve § 7.5'teki kapsam kararı gözden geçirilir.
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }));
    const adlar = s.kalemler.map((k) => k.ad.toLocaleLowerCase('tr'));

    for (const yasak of ['noter', 'müşavir', 'imza', 'mühür']) {
      expect(adlar.some((ad) => ad.includes(yasak))).toBe(false);
    }
  });

  it('TTSG satırı kelime sayısını ve birim ücreti açıklıyor', () => {
    const s = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 4000 }));
    const ttsg = kalem(s, 'Ticaret Sicili Gazetesi ilan ücreti');

    // Uzun sözleşmede bu kalem tek başına sabit giderleri aşıyor —
    // kelime sayısının neden sorulduğunun gerekçesi.
    expect(ttsg?.tutar).toBe(9920);
    expect(ttsg?.detay).toBe('4.000 kelime × 2,48 TL');
  });

  it('sermaye büyüdükçe yalnızca Rekabet payı değişiyor', () => {
    const kucuk = hesap(kurulusMaliyetiHesapla({ yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }));
    const buyuk = hesap(
      kurulusMaliyetiHesapla({ yil: 2026, sermaye: 5_000_000, kelimeSayisi: 1500 })
    );

    expect(kalem(buyuk, 'Rekabet Kurumu payı')?.tutar).toBe(2000);
    expect(kalem(buyuk, 'Oda kayıt ücreti')?.tutar).toBe(kalem(kucuk, 'Oda kayıt ücreti')?.tutar);
    expect(buyuk.toplam - kucuk.toplam).toBe(2000 - 20);
  });

  it('tavanı aşan sermaye reddedilir — taşma koruması', () => {
    expect(
      kurulusMaliyetiHesapla({ yil: 2026, sermaye: EN_COK_SERMAYE + 1, kelimeSayisi: 1500 })
    ).toEqual({ durum: 'gecersiz-sermaye', asgari: LIMITED_ASGARI_SERMAYE });

    const s = hesap(
      kurulusMaliyetiHesapla({ yil: 2026, sermaye: EN_COK_SERMAYE, kelimeSayisi: 1500 })
    );
    expect(Number.isSafeInteger(Math.round(s.toplam * 100))).toBe(true);
  });
});

describe('tarife tablosu ve sabitler', () => {
  it('2026 tarifesi belgedeki değerlerle birebir', () => {
    expect(tarifeBul(2026)).toEqual({
      odaKayit: 3900,
      beyanname: 250,
      tasdik: 2500,
      ttsgKelime: 2.48,
    });
  });

  it('Rekabet payı oranı on binde dört', () => {
    expect(REKABET_PAYI_PAY / REKABET_PAYI_PAYDA).toBe(0.0004);
  });

  it('asgari sermaye 50.000 TL', () => {
    expect(LIMITED_ASGARI_SERMAYE).toBe(50_000);
  });

  it('tarifeliYillar yeniden eskiye sıralar', () => {
    const yillar = tarifeliYillar();
    expect(yillar).toEqual([...yillar].sort((a, b) => b - a));
    expect(yillar).toContain(2026);
  });

  it('her tarifedeki tutarlar pozitif', () => {
    for (const [yil, tarife] of Object.entries(KURULUS_TARIFELERI)) {
      for (const [ad, deger] of Object.entries(tarife)) {
        expect(deger, `${yil}.${ad}`).toBeGreaterThan(0);
      }
    }
  });
});
