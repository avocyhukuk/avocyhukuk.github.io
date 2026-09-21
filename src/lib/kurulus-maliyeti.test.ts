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
  ASGARI_SERMAYE,
  AS_BLOKAJ_YUZDE,
  KURULUS_TARIFELERI,
  REKABET_PAYI_PAY,
  REKABET_PAYI_PAYDA,
  tarifeBul,
  tarifeliYillar,
} from './kurulus-tarifeleri';

/** Limited varsayılanı — tür bazlı testler bunu açıkça ezer. */
const LTD = { tur: 'limited' } as const;
const AS = { tur: 'anonim' } as const;

function hesap(sonuc: KurulusSonucu) {
  if (sonuc.durum !== 'hesaplandi') throw new Error(`beklenmeyen durum: ${sonuc.durum}`);
  return sonuc;
}

const kalem = (s: ReturnType<typeof hesap>, ad: string) => s.kalemler.find((k) => k.ad === ad);

describe('kuruluş maliyeti — belgedeki senaryolar', () => {
  it('senaryo 1 — 50.000 TL sermaye, 1.500 kelime, 2026', () => {
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })
    );

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
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 250_000, kelimeSayisi: 2000 })
    );

    expect(kalem(s, 'Ticaret Sicili Gazetesi ilan ücreti')?.tutar).toBe(4960);
    expect(kalem(s, 'Rekabet Kurumu payı')?.tutar).toBe(100);
    expect(s.toplam).toBe(11_710);
  });

  it('senaryo 3 — asgari sermayenin altı reddedilir', () => {
    expect(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 49_999, kelimeSayisi: 1500 })
    ).toEqual({
      durum: 'gecersiz-sermaye',
      asgari: ASGARI_SERMAYE.limited,
    });

    // Tam sınır kabul edilir.
    expect(
      hesap(kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }))
        .toplam
    ).toBe(10_390);
  });

  it('senaryo 4 — geçersiz kelime sayısı', () => {
    for (const kelimeSayisi of [0, -10, 12.5, Number.NaN, EN_COK_KELIME + 1]) {
      expect(kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi })).toEqual({
        durum: 'gecersiz-kelime',
      });
    }
  });

  it('senaryo 5 — tarifesi olmayan yılda hesap yapılmaz', () => {
    expect(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2027, sermaye: 50_000, kelimeSayisi: 1500 })
    ).toEqual({
      durum: 'tarife-yok',
      yil: 2027,
    });
  });

  it('senaryo 6 — tescil harcı satırı 0,00 ve toplama girmiyor', () => {
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })
    );
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
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 123_456.78, kelimeSayisi: 1337 })
    );
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
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })
    );

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
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })
    );
    const adlar = s.kalemler.map((k) => k.ad.toLocaleLowerCase('tr'));

    for (const yasak of ['noter', 'müşavir', 'imza', 'mühür']) {
      expect(adlar.some((ad) => ad.includes(yasak))).toBe(false);
    }
  });

  it('TTSG satırı kelime sayısını ve birim ücreti açıklıyor', () => {
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 4000 })
    );
    const ttsg = kalem(s, 'Ticaret Sicili Gazetesi ilan ücreti');

    // Uzun sözleşmede bu kalem tek başına sabit giderleri aşıyor —
    // kelime sayısının neden sorulduğunun gerekçesi.
    expect(ttsg?.tutar).toBe(9920);
    expect(ttsg?.detay).toBe('4.000 kelime × 2,48 TL');
  });

  it('sermaye büyüdükçe yalnızca Rekabet payı değişiyor', () => {
    const kucuk = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })
    );
    const buyuk = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 5_000_000, kelimeSayisi: 1500 })
    );

    expect(kalem(buyuk, 'Rekabet Kurumu payı')?.tutar).toBe(2000);
    expect(kalem(buyuk, 'Oda kayıt ücreti')?.tutar).toBe(kalem(kucuk, 'Oda kayıt ücreti')?.tutar);
    expect(buyuk.toplam - kucuk.toplam).toBe(2000 - 20);
  });

  it('tavanı aşan sermaye reddedilir — taşma koruması', () => {
    expect(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: EN_COK_SERMAYE + 1, kelimeSayisi: 1500 })
    ).toEqual({ durum: 'gecersiz-sermaye', asgari: ASGARI_SERMAYE.limited });

    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: EN_COK_SERMAYE, kelimeSayisi: 1500 })
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

  it('asgari sermaye türe göre', () => {
    expect(ASGARI_SERMAYE.limited).toBe(50_000);
    expect(ASGARI_SERMAYE.anonim).toBe(250_000);
  });

  it('anonim şirket blokaj oranı yüzde yirmibeş', () => {
    expect(AS_BLOKAJ_YUZDE).toBe(25);
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

describe('anonim şirket — docs § 7.12', () => {
  it('senaryo 8 — 250.000 TL sermaye, 2.500 kelime, 2026', () => {
    const s = hesap(
      kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 250_000, kelimeSayisi: 2500 })
    );

    // Sabit kısım limitedle aynı: 3.900 + 250 + 2.500
    expect(kalem(s, 'Oda kayıt ücreti')?.tutar).toBe(3900);
    expect(kalem(s, 'Beyanname ücreti')?.tutar).toBe(250);
    expect(kalem(s, 'Defter ve kuruluş tasdik ücreti')?.tutar).toBe(2500);
    // 2.500 × 2,48
    expect(kalem(s, 'Ticaret Sicili Gazetesi ilan ücreti')?.tutar).toBe(6200);
    // 250.000 × 4 / 10.000
    expect(kalem(s, 'Rekabet Kurumu payı')?.tutar).toBe(100);

    expect(s.toplam).toBe(12_950);

    // Blokaj AYRI — toplama girmiyor.
    expect(s.blokaj).toBe(62_500);
  });

  it('senaryo 9 — anonimde asgari sermaye 250.000 TL', () => {
    expect(
      kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 249_999, kelimeSayisi: 1500 })
    ).toEqual({ durum: 'gecersiz-sermaye', asgari: 250_000 });

    // Tam sınır kabul edilir.
    expect(
      hesap(kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 250_000, kelimeSayisi: 1500 })).tur
    ).toBe('anonim');
  });

  it('senaryo 10 — limitedin sınırı anonimden etkilenmiyor', () => {
    // 50.000 TL limitede geçerli, anonimde değil. İki eşiğin birbirine
    // karışmadığını sabitliyor.
    expect(
      hesap(kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 }))
        .toplam
    ).toBe(10_390);

    expect(
      kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 50_000, kelimeSayisi: 1500 })
    ).toEqual({ durum: 'gecersiz-sermaye', asgari: 250_000 });
  });

  it('senaryo 11 — limitedde blokaj yok', () => {
    // 7099 s.K. sonrası limitedde kuruluşta blokaj aranmıyor; notun
    // gösterilmemesi buna bağlı.
    const s = hesap(
      kurulusMaliyetiHesapla({ ...LTD, yil: 2026, sermaye: 250_000, kelimeSayisi: 1500 })
    );
    expect(s.blokaj).toBeUndefined();
    expect(s.tur).toBe('limited');
  });

  it('senaryo 12 — aynı sermaye ve kelimede iki türün TOPLAMI eşit', () => {
    // Tür yalnızca asgari sınırı ve blokajı etkiliyor; hiçbir KALEM türe
    // bağlı değil. Biri ileride türe bağlı bir kalem eklerse bu test kırılır.
    const ortak = { yil: 2026, sermaye: 250_000, kelimeSayisi: 2500 } as const;
    const ltd = hesap(kurulusMaliyetiHesapla({ ...LTD, ...ortak }));
    const as = hesap(kurulusMaliyetiHesapla({ ...AS, ...ortak }));

    expect(as.toplam).toBe(ltd.toplam);
    expect(as.kalemler.map((k) => k.tutar)).toEqual(ltd.kalemler.map((k) => k.tutar));
  });

  it('blokaj kalem listesinde DEĞİL — masraf değil', () => {
    const s = hesap(
      kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 250_000, kelimeSayisi: 2500 })
    );

    expect(s.kalemler.some((k) => k.ad.toLocaleLowerCase('tr').includes('blokaj'))).toBe(false);
    // Kalemlerin toplamı blokajı içermiyor.
    const kalemToplami = s.kalemler
      .filter((k) => !k.bilgi)
      .reduce((t, k) => t + Math.round(k.tutar * 100), 0);
    expect(kalemToplami / 100).toBe(s.toplam);
  });

  it('blokaj kuruşta hesaplanıyor', () => {
    // 250.000,10 TL → 25.000.010 kuruş × 25 / 100 = 6.250.002,5 → 6.250.003
    const s = hesap(
      kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 250_000.1, kelimeSayisi: 1500 })
    );
    expect(s.blokaj).toBe(62_500.03);
  });

  it('tescil harcı satırı anonimde de 0,00 ve aynı dayanakta', () => {
    const s = hesap(
      kurulusMaliyetiHesapla({ ...AS, yil: 2026, sermaye: 250_000, kelimeSayisi: 1500 })
    );
    const harc = kalem(s, 'Ticaret sicili tescil harcı');

    expect(harc?.tutar).toBe(0);
    expect(harc?.bilgi).toBe(true);
    expect(harc?.dayanak?.short).toBe('492 m.123');
    expect(harc?.detay).toBe('Anonim şirket kuruluşunda alınmaz — tam istisna');
  });
});
