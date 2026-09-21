/**
 * docs/hesaplama-formulleri.md § 5 — araç mahrumiyet bedeli.
 *
 * Ana fikstür, onay mesajındaki senaryo: 10 gün × 1.000–1.500 TL.
 * Diğer testler kuruş aritmetiğini, doğrulama dallarını ve taşma
 * korumasını zorluyor.
 */
import { describe, expect, it } from 'vitest';
import {
  EN_AZ_TEKLIF,
  EN_COK_GUN,
  EN_COK_GUNLUK_BEDEL,
  mahrumiyetBedeliHesapla,
  teklifleriTopla,
  type MahrumiyetSonucu,
} from './mahrumiyet-bedeli';

/** Sonucu daraltır; hesaplanmadıysa testi anlamlı biçimde düşürür. */
function hesap(sonuc: MahrumiyetSonucu) {
  if (sonuc.durum !== 'hesaplandi') throw new Error(`beklenmeyen durum: ${sonuc.durum}`);
  return sonuc;
}

describe('mahrumiyet bedeli hesabı', () => {
  it('onaylanan senaryo — 10 gün, 1.000 ve 1.500 TL', () => {
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [1000, 1500] }));

    expect(s.alt).toBe(10_000);
    expect(s.ust).toBe(15_000);
    expect(s.ortalama).toBe(12_500);

    expect(s.tutarlar).toEqual([
      { gunlukBedel: 1000, tutar: 10_000 },
      { gunlukBedel: 1500, tutar: 15_000 },
    ]);
  });

  it('teklifler eşitse aralık tek noktaya iner', () => {
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 7, gunlukBedeller: [800, 800] }));

    expect(s.alt).toBe(5600);
    expect(s.ust).toBe(5600);
    expect(s.ortalama).toBe(5600);
  });

  it('teklif sırası sonucu değiştirmez', () => {
    const artan = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [1000, 1500] }));
    const azalan = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [1500, 1000] }));

    expect(azalan.alt).toBe(artan.alt);
    expect(azalan.ust).toBe(artan.ust);
    expect(azalan.ortalama).toBe(artan.ortalama);
  });

  it('yalnızca BİRİNCİ fiyat alanı doluysa tek tutar döner', () => {
    const bedeller = teklifleriTopla(['1000', '']);
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: bedeller }));

    // Tek eleman: arayüz buna bakıp aralık yerine tek tutar gösterir.
    expect(s.tutarlar).toHaveLength(1);
    expect(s.tutarlar[0]).toEqual({ gunlukBedel: 1000, tutar: 10_000 });

    // Aralık uçları ve ortalama aynı değere iner.
    expect(s.alt).toBe(10_000);
    expect(s.ust).toBe(10_000);
    expect(s.ortalama).toBe(10_000);
  });

  it('yalnızca İKİNCİ fiyat alanı doluysa aynı formül işler', () => {
    const bedeller = teklifleriTopla(['', '1500']);
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: bedeller }));

    expect(s.tutarlar).toHaveLength(1);
    expect(s.tutarlar[0]).toEqual({ gunlukBedel: 1500, tutar: 15_000 });
    expect(s.alt).toBe(15_000);
    expect(s.ust).toBe(15_000);
    expect(s.ortalama).toBe(15_000);
  });

  it('tek teklifin sonucu, iki teklifli hesaptaki kendi satırıyla birebir aynı', () => {
    // "İkisi de aynı gün × bedel formülünü kullanmalı" — tek teklifli dalın
    // ayrı bir hesap yolu OLMADIĞINI sabitler.
    const ikili = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [1000, 1500] }));

    for (const [sira, ham] of [
      ['1000', ''],
      ['', '1500'],
    ].entries()) {
      const tekli = hesap(
        mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: teklifleriTopla(ham) })
      );
      expect(tekli.tutarlar[0]).toEqual(ikili.tutarlar[sira]);
    }
  });

  it('ikiden fazla teklif de kabul edilir', () => {
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 5, gunlukBedeller: [1000, 1200, 1400] }));

    expect(s.alt).toBe(5000);
    expect(s.ust).toBe(7000);
    expect(s.ortalama).toBe(6000);
  });
});

describe('kuruş aritmetiği', () => {
  it('kayan nokta kayması yok — 3 × 1000,10', () => {
    // Doğrudan çarpımda 3000.2999999999997 çıkar; kuruş tabanında çıkmaz.
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 3, gunlukBedeller: [1000.1, 2000.2] }));

    expect(s.alt).toBe(3000.3);
    expect(s.ust).toBe(6000.6);
    expect(s.ortalama).toBe(4500.45);
  });

  it('ortalama yarım kuruşta yukarı yuvarlanır', () => {
    // 8.641,92 + 12.523,07 = 21.164,99 → yarısı 10.582,495
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 7, gunlukBedeller: [1234.56, 1789.01] }));

    expect(s.alt).toBe(8641.92);
    expect(s.ust).toBe(12_523.07);
    expect(s.ortalama).toBe(10_582.5);
  });

  it('bedel kuruşa yuvarlanır ve yuvarlanmış hâli geri döner', () => {
    // Kullanıcı 999,999 girerse hesap 1.000,00 ile yapılır; sonuç satırı
    // da bunu göstermeli, yoksa "10 gün × 999,999" gibi bir açıklama çıkar.
    const s = hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [999.999, 1500] }));

    expect(s.tutarlar[0]).toEqual({ gunlukBedel: 1000, tutar: 10_000 });
  });

  it('büyük girdilerde bile güvenli tam sayı aralığında kalır', () => {
    const s = hesap(
      mahrumiyetBedeliHesapla({
        gun: EN_COK_GUN,
        gunlukBedeller: [EN_COK_GUNLUK_BEDEL, EN_COK_GUNLUK_BEDEL],
      })
    );

    expect(Number.isSafeInteger(Math.round(s.ust * 100))).toBe(true);
    expect(s.ust).toBe(EN_COK_GUN * EN_COK_GUNLUK_BEDEL);
  });
});

describe('gün sayısı doğrulaması', () => {
  it('tam sayı ve 1 ile üst sınır arasında olmalı', () => {
    for (const gun of [0, -1, 2.5, Number.NaN, Number.POSITIVE_INFINITY, EN_COK_GUN + 1]) {
      expect(mahrumiyetBedeliHesapla({ gun, gunlukBedeller: [1000, 1500] })).toEqual({
        durum: 'gecersiz-gun',
      });
    }
  });

  it('sınır değerler kabul edilir', () => {
    expect(hesap(mahrumiyetBedeliHesapla({ gun: 1, gunlukBedeller: [1000, 1500] })).ortalama).toBe(
      1250
    );
    expect(
      hesap(mahrumiyetBedeliHesapla({ gun: EN_COK_GUN, gunlukBedeller: [100, 100] })).ust
    ).toBe(365_000);
  });

  it('gün ve teklif birlikte geçersizse gün mesajı döner', () => {
    // Deterministik olsun diye: iki alan da boşken kullanıcı hep aynı
    // uyarıyı görür, sırayla iki farklı hata mesajı almaz.
    expect(mahrumiyetBedeliHesapla({ gun: 0, gunlukBedeller: [] })).toEqual({
      durum: 'gecersiz-gun',
    });
  });
});

describe('bedel doğrulaması', () => {
  it('sıfır, negatif ve sayı olmayan bedel reddedilir', () => {
    for (const bedel of [0, -100, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [1000, bedel] })).toEqual({
        durum: 'gecersiz-bedel',
      });
    }
  });

  it('kuruşa yuvarlanınca sıfırlanan bedel reddedilir', () => {
    // 0,004 TL → 0 kuruş. Yuvarlamadan önce baksaydık geçerli sayılır ve
    // sessizce 0,00 TL tutar üretirdi.
    expect(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [0.004, 1500] })).toEqual({
      durum: 'gecersiz-bedel',
    });
  });

  it('üst sınırı aşan bedel reddedilir — taşma koruması', () => {
    expect(
      mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [EN_COK_GUNLUK_BEDEL + 0.01, 1500] })
    ).toEqual({ durum: 'gecersiz-bedel' });

    expect(
      hesap(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [EN_COK_GUNLUK_BEDEL, 1500] })).ust
    ).toBe(10_000_000);
  });

  it('hiç teklif yoksa hesap yapılmaz', () => {
    expect(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: [] })).toEqual({
      durum: 'yetersiz-teklif',
    });

    // Tek teklif YETERLİ — bu sınır bilinçli olarak 1.
    expect(EN_AZ_TEKLIF).toBe(1);
  });
});

describe('form alanlarının okunması', () => {
  it('boş alanlar atlanır, dolu olanlar sırasını korur', () => {
    expect(teklifleriTopla(['1000', '1500'])).toEqual([1000, 1500]);
    expect(teklifleriTopla(['1000', ''])).toEqual([1000]);
    expect(teklifleriTopla(['', '1500'])).toEqual([1500]);
    expect(teklifleriTopla(['', ''])).toEqual([]);
  });

  it('yalnızca boşluk içeren alan boş sayılır', () => {
    expect(teklifleriTopla(['   ', '1500'])).toEqual([1500]);
  });

  it('YAZILMIŞ sıfır atlanmaz — boş alanla aynı şey değil', () => {
    // Boş alan "teklif vermedim", sıfır ise hatalı bir teklif. İkincisi
    // sessizce atılırsa kullanıcı yanlış girdiğini hiç öğrenemez.
    const bedeller = teklifleriTopla(['0', '1500']);
    expect(bedeller).toEqual([0, 1500]);
    expect(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: bedeller })).toEqual({
      durum: 'gecersiz-bedel',
    });
  });

  it('sayıya çevrilemeyen değer atılmaz, reddedilir', () => {
    const bedeller = teklifleriTopla(['abc', '1500']);
    expect(bedeller[0]).toBeNaN();
    expect(mahrumiyetBedeliHesapla({ gun: 10, gunlukBedeller: bedeller })).toEqual({
      durum: 'gecersiz-bedel',
    });
  });
});
