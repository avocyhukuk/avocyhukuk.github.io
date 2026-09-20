/**
 * docs/hesaplama-formulleri.md § 6 — harç ve masraf.
 *
 * Ana fikstürler § 6.7c'deki iki örnek hesap. Diğer testler kalem
 * listesinin koşullu dallarını ve bayatlama korumasını zorluyor.
 */
import { describe, expect, it } from 'vitest';
import { harcMasrafHesapla, type HarcMasrafSonucu } from './harc-masraf';
import { HARC_TARIFELERI, tarifeBul, tarifeliYillar } from './harc-tarifeleri';

/** Hesaplanan sonucu daraltır; değilse testi anlamlı biçimde düşürür. */
function hesap(s: HarcMasrafSonucu) {
  if (s.durum !== 'hesaplandi') throw new Error(`beklenmeyen durum: ${s.durum}`);
  return s;
}

const kalem = (s: ReturnType<typeof hesap>, ad: string) => s.kalemler.find((k) => k.ad === ad);

describe('dava açılış maliyeti', () => {
  it('belgedeki örnek — 100.000 TL, asliye, 2 taraf, avukatlı', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        davaDegeri: 100_000,
        tarafSayisi: 2,
        avukatli: true,
      })
    );

    expect(kalem(s, 'Başvurma harcı')?.tutar).toBe(732);
    expect(kalem(s, 'Peşin harç')?.tutar).toBe(1707.75);
    expect(kalem(s, 'Gider avansı — tebligat')?.tutar).toBe(2650);
    expect(kalem(s, 'Gider avansı — diğer iş ve işlemler')?.tutar).toBe(530);
    expect(kalem(s, 'Baro pulu')?.tutar).toBe(164);
    expect(kalem(s, 'Vekâlet suret harcı')?.tutar).toBe(104);

    expect(s.toplam).toBe(5887.75);
  });

  it('bakiye nispi harç bilgi satırı — toplama GİRMEZ', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        davaDegeri: 100_000,
        tarafSayisi: 2,
        avukatli: true,
      })
    );

    const bakiye = kalem(s, 'Bakiye nispi karar ve ilam harcı');
    expect(bakiye?.bilgi).toBe(true);
    // Nispi harç 6.831,00 · peşin 1.707,75 → bakiye 5.123,25
    expect(bakiye?.tutar).toBe(5123.25);

    // Bilgi satırı toplama katılmadığı için toplam değişmedi
    expect(s.toplam).toBe(5887.75);
  });

  it('ASGARİ TABAN YORUMU — taban nispi harca uygulanır, peşin onun 1/4ü', () => {
    // Bu test onaylanan yorumu sabitliyor. Yorum değişirse (taban
    // doğrudan peşin harca uygulanacaksa) yalnızca bu test kırılır ve
    // düzeltilecek yer belli olur: harc-masraf.ts içindeki davaHesapla.
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        davaDegeri: 5_000,
        tarafSayisi: 2,
        avukatli: false,
      })
    );

    // Ham nispi: 5.000 × binde 68,31 = 341,55 → taban 732,00
    // Peşin: 732,00 / 4 = 183,00   (alternatif okuma 732,00 olurdu)
    expect(kalem(s, 'Peşin harç')?.tutar).toBe(183);
    expect(kalem(s, 'Peşin harç')?.detay).toContain('asgari tabana');
    expect(kalem(s, 'Bakiye nispi karar ve ilam harcı')?.tutar).toBe(549);
  });

  it('taban devreye girmeyen davada açıklama taban demez', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        davaDegeri: 100_000,
        tarafSayisi: 2,
        avukatli: false,
      })
    );

    expect(kalem(s, 'Peşin harç')?.detay).toContain('dörtte biri');
    expect(kalem(s, 'Peşin harç')?.detay).not.toContain('taban');
  });

  it('konusu para ile ölçülemeyen dava — maktu harç, nispi satır yok', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        tarafSayisi: 2,
        avukatli: false,
      })
    );

    expect(kalem(s, 'Maktu karar ve ilam harcı')?.tutar).toBe(732);
    expect(kalem(s, 'Peşin harç')).toBeUndefined();
    expect(kalem(s, 'Bakiye nispi karar ve ilam harcı')).toBeUndefined();
    // 732 + 732 + 2650 + 530
    expect(s.toplam).toBe(4644);
  });

  it('sulh mahkemesinde başvurma harcı farklı', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'sulh',
        tarafSayisi: 2,
        avukatli: false,
      })
    );

    expect(kalem(s, 'Başvurma harcı')?.tutar).toBe(335.2);
  });

  it('avukatsız takipte baro pulu ve suret harcı hiç eklenmez', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        davaDegeri: 100_000,
        tarafSayisi: 2,
        avukatli: false,
      })
    );

    expect(kalem(s, 'Baro pulu')).toBeUndefined();
    expect(kalem(s, 'Vekâlet suret harcı')).toBeUndefined();
    // Avukatlı örnekten 164 + 104 eksik
    expect(s.toplam).toBe(5887.75 - 268);
  });

  it('taraf sayısı tebligat giderini doğrudan katlıyor', () => {
    const uc = hesap(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2026,
        mahkeme: 'asliye',
        tarafSayisi: 3,
        avukatli: false,
      })
    );

    // 3 × 5 × 265
    expect(kalem(uc, 'Gider avansı — tebligat')?.tutar).toBe(3975);
  });

  it('en az iki taraf gerekir', () => {
    for (const tarafSayisi of [1, 0, -1, 2.5]) {
      expect(
        harcMasrafHesapla({
          tur: 'dava',
          yil: 2026,
          mahkeme: 'asliye',
          tarafSayisi,
          avukatli: false,
        })
      ).toEqual({ durum: 'gecersiz-taraf' });
    }
  });

  it('nispi davada geçersiz dava değeri reddedilir', () => {
    for (const davaDegeri of [0, -5, Number.NaN]) {
      expect(
        harcMasrafHesapla({
          tur: 'dava',
          yil: 2026,
          mahkeme: 'asliye',
          davaDegeri,
          tarafSayisi: 2,
          avukatli: false,
        })
      ).toEqual({ durum: 'gecersiz-deger' });
    }
  });
});

describe('icra takibi açılış maliyeti', () => {
  it('belgedeki örnek — 100.000 TL ilamsız, 1 borçlu, avukatlı', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'icra',
        yil: 2026,
        takip: 'ilamsiz',
        alacak: 100_000,
        borcluSayisi: 1,
        avukatli: true,
      })
    );

    expect(kalem(s, 'Başvuru harcı')?.tutar).toBe(732);
    expect(kalem(s, 'Peşin harç')?.tutar).toBe(500);
    expect(kalem(s, 'Tebligat')?.tutar).toBe(265);
    expect(s.toplam).toBe(1765);
  });

  it('icrada tebligat KATLANMAZ — İİK m.59, işlem başına masraf', () => {
    // Dava tarafındaki ×5 katsayısı HMK gider avansına ait; icrada yok.
    const s = hesap(
      harcMasrafHesapla({
        tur: 'icra',
        yil: 2026,
        takip: 'ilamsiz',
        alacak: 50_000,
        borcluSayisi: 3,
        avukatli: false,
      })
    );

    // 3 borçlu × 265 — beş katı DEĞİL
    expect(kalem(s, 'Tebligat')?.tutar).toBe(795);
  });

  it('ilamlı takipte peşin harç alınmaz', () => {
    const s = hesap(
      harcMasrafHesapla({
        tur: 'icra',
        yil: 2026,
        takip: 'ilamli',
        borcluSayisi: 1,
        avukatli: false,
      })
    );

    const pesin = kalem(s, 'Peşin harç alınmaz');
    expect(pesin?.bilgi).toBe(true);
    expect(pesin?.tutar).toBe(0);
    // 732 + 265
    expect(s.toplam).toBe(997);
  });

  it('ilamsız takipte alacak zorunlu', () => {
    expect(
      harcMasrafHesapla({
        tur: 'icra',
        yil: 2026,
        takip: 'ilamsiz',
        borcluSayisi: 1,
        avukatli: false,
      })
    ).toEqual({ durum: 'gecersiz-deger' });
  });

  it('en az bir borçlu gerekir', () => {
    expect(
      harcMasrafHesapla({
        tur: 'icra',
        yil: 2026,
        takip: 'ilamli',
        borcluSayisi: 0,
        avukatli: false,
      })
    ).toEqual({ durum: 'gecersiz-taraf' });
  });
});

describe('tarife tablosu', () => {
  it('tarifesi olmayan yıl için hesap yapılmaz', () => {
    expect(
      harcMasrafHesapla({
        tur: 'dava',
        yil: 2027,
        mahkeme: 'asliye',
        tarafSayisi: 2,
        avukatli: false,
      })
    ).toEqual({ durum: 'tarife-yok', yil: 2027 });

    expect(
      harcMasrafHesapla({
        tur: 'icra',
        yil: 2019,
        takip: 'ilamli',
        borcluSayisi: 1,
        avukatli: false,
      })
    ).toEqual({ durum: 'tarife-yok', yil: 2019 });
  });

  it('2026 tarifesi belgedeki değerlerle birebir', () => {
    const t = tarifeBul(2026)!;
    expect(t).toEqual({
      basvurmaSulh: 335.2,
      basvurmaAsliye: 732,
      icraBasvuru: 732,
      nispiBinde: 68.31,
      nispiAsgari: 732,
      maktuKararIlam: 732,
      icraPesinBinde: 5,
      tebligat: 265,
      tebligatKatsayisi: 5,
      giderAvansiMaktu: 530,
      baroPulu: 164,
      vekaletSuret: 104,
    });
  });

  it('tarifeliYillar yeniden eskiye sıralar', () => {
    const y = tarifeliYillar();
    expect(y).toEqual([...y].sort((a, b) => b - a));
    expect(y).toContain(2026);
  });

  it('her tarifedeki tutarlar pozitif', () => {
    for (const [yil, t] of Object.entries(HARC_TARIFELERI)) {
      for (const [ad, deger] of Object.entries(t)) {
        expect(deger, `${yil}.${ad}`).toBeGreaterThan(0);
      }
    }
  });
});
