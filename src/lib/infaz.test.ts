/**
 * docs/hesaplama-formulleri.md § 1.15 — çekirdek fikstür.
 *
 * Yedi senaryonun beklenen tarihleri Av. Onur Can Yılmaz tarafından
 * onaylandı (23.09.2026). Buradaki değerler o tablodan geliyor; testler
 * değiştirilecekse önce belge güncellenmeli.
 *
 * Hepsi A okuması (mahsup → oran) ve yıl-ay-gün seviyesinde oranla
 * hesaplandı.
 */
import { describe, expect, it } from 'vitest';
import {
  acigaAyrilma,
  bihakkinTahliye,
  infazHesapla,
  ksEsigi,
  type InfazGirdi,
  type InfazSonucu,
} from './infaz';
import { temelOran, yuksekOran } from './infaz-oranlari';
import { sureYaz } from './infaz-sure';

const utc = (yil: number, ay: number, gun: number) => new Date(Date.UTC(yil, ay - 1, gun));
const gun = (t: Date) => t.toISOString().slice(0, 10);

function hesap(sonuc: InfazSonucu) {
  if (sonuc.durum !== 'hesaplandi') throw new Error(`beklenmeyen durum: ${sonuc.durum}`);
  return sonuc;
}

/** Fikstür girdilerinin ortak iskeleti. */
const temel = (o: Partial<InfazGirdi>): InfazGirdi => ({
  infazaBaslama: utc(2026, 3, 1),
  sucTarihi: utc(2024, 9, 10),
  ceza: { yil: 5, ay: 0, gun: 0 },
  kategori: 'adi',
  mahsupGun: 0,
  tekerrur: 'yok',
  ...o,
});

describe('çekirdek fikstür — yedi senaryo', () => {
  it('1 · adi suç, 5 yıl, mahsup yok', () => {
    const s = hesap(infazHesapla(temel({})));

    expect(sureYaz(s.ks.infazSuresi)).toBe('2 yıl 6 ay');
    expect(s.ks.infazSuresiGun).toBe(910);

    expect(gun(s.ksTarihi)).toBe('2028-08-27');
    expect(gun(s.ds.tarih)).toBe('2027-08-28');
    expect(gun(s.bihakkin)).toBe('2031-02-28');
  });

  it('2 · adi suç, 5 yıl, 90 gün mahsup', () => {
    const s = hesap(infazHesapla(temel({ mahsupGun: 90 })));

    // Mahsup ÖNCE düşülüyor: 5 yıl − 90 gün = 4 yıl 9 ay, yarısı…
    expect(sureYaz(s.ks.kalanCeza)).toBe('4 yıl 9 ay');
    expect(sureYaz(s.ks.infazSuresi)).toBe('2 yıl 4 ay 15 gün');
    expect(s.ks.infazSuresiGun).toBe(865);

    expect(gun(s.ksTarihi)).toBe('2028-07-13');
    expect(gun(s.ds.tarih)).toBe('2027-07-14');
    expect(gun(s.bihakkin)).toBe('2030-11-25');
  });

  it('3 · kasten öldürme, 18 yıl, 240 gün mahsup', () => {
    const s = hesap(
      infazHesapla(
        temel({
          infazaBaslama: utc(2026, 1, 20),
          sucTarihi: utc(2024, 11, 15),
          ceza: { yil: 18, ay: 0, gun: 0 },
          kategori: 'katalog',
          mahsupGun: 240,
        })
      )
    );

    expect(s.ks.oran.metin).toBe('2/3');
    expect(sureYaz(s.ks.kalanCeza)).toBe('17 yıl 4 ay');
    expect(sureYaz(s.ks.infazSuresi)).toBe('11 yıl 6 ay 20 gün');
    expect(s.ks.infazSuresiGun).toBe(4215);

    expect(gun(s.ksTarihi)).toBe('2037-08-05');
    expect(gun(s.ds.tarih)).toBe('2036-08-05');
    expect(gun(s.bihakkin)).toBe('2043-05-16');
  });

  it('4 · hâl C — Geçici m.10/6 DS kaydırması (4 yıl)', () => {
    const s = hesap(
      infazHesapla(
        temel({
          infazaBaslama: utc(2026, 2, 1),
          // 30.03.2020 sonrası, 31.07.2023 öncesi → hâl C
          sucTarihi: utc(2023, 5, 10),
          ceza: { yil: 12, ay: 0, gun: 0 },
          acikKurumUcAy: true,
        })
      )
    );

    expect(s.ds.hal).toBe('hal-c');
    expect(s.ks.infazSuresiGun).toBe(2190);
    expect(gun(s.ksTarihi)).toBe('2032-01-31');
    expect(gun(s.ds.tarih)).toBe('2028-02-01');
    expect(gun(s.bihakkin)).toBe('2038-01-29');

    // 1/10 TABANI devrede değil — suç 04.06.2025 öncesi (Geçici m.11).
    expect(s.ds.birOndaTabani).toBeUndefined();
  });

  it('4b · hâl C KAPISI kapalıysa kaydırma HİÇ uygulanmaz', () => {
    // "Açık kurumda 3 ay" işaretlenmezse hâl C aday bile olmuyor;
    // DS standart 1 yıla düşüyor. Kapı ile tabanın farkı tam burada.
    const s = hesap(
      infazHesapla(
        temel({
          infazaBaslama: utc(2026, 2, 1),
          sucTarihi: utc(2023, 5, 10),
          ceza: { yil: 12, ay: 0, gun: 0 },
          acikKurumUcAy: false,
        })
      )
    );

    expect(s.ds.hal).toBe('standart');
    // 31.01.2032 − 365 gün. (2031 artık yıl değil, Şubat 28 çekiyor.)
    expect(gun(s.ds.tarih)).toBe('2031-01-31');
  });

  it('5 · m.105/A 1/10 tabanı — suç 04.06.2025 sonrası', () => {
    const s = hesap(
      infazHesapla(
        temel({
          sucTarihi: utc(2025, 8, 15),
          ceza: { yil: 1, ay: 2, gun: 0 },
        })
      )
    );

    expect(s.ks.infazSuresiGun).toBe(210);
    expect(gun(s.ksTarihi)).toBe('2026-09-27');

    // Standart DS (210 − 365) negatif → alt sınır, sonra 1/10 tabanı.
    expect(s.ds.altSinirUygulandi).toBe(true);
    expect(s.ds.birOndaTabani).toEqual({ gerekenGun: 21, uygulandi: true });
    expect(gun(s.ds.tarih)).toBe('2026-03-22');

    expect(gun(s.bihakkin)).toBe('2027-04-30');
  });

  it('6 · mükerrir, 6 yıl, önceki ilam 2 yıl — tavan devrede DEĞİL', () => {
    const s = hesap(
      infazHesapla(
        temel({
          infazaBaslama: utc(2026, 5, 10),
          sucTarihi: utc(2024, 3, 20),
          ceza: { yil: 6, ay: 0, gun: 0 },
          tekerrur: 'birinci',
          oncekiIlam: { yil: 2, ay: 0, gun: 0 },
        })
      )
    );

    expect(s.ks.oran.metin).toBe('2/3');
    expect(sureYaz(s.ks.mukerrirTaban!)).toBe('3 yıl');
    expect(sureYaz(s.ks.tekerrurEklemesi!)).toBe('1 yıl');
    expect(s.ks.tavanDevredeMi).toBe(false);
    expect(sureYaz(s.ks.infazSuresi)).toBe('4 yıl');
    expect(s.ks.infazSuresiGun).toBe(1460);

    expect(gun(s.ksTarihi)).toBe('2030-05-09');
    expect(gun(s.ds.tarih)).toBe('2029-05-09');
    expect(gun(s.bihakkin)).toBe('2032-05-08');
  });

  it('6b · aynısı, önceki ilam 6 AY — m.108/2 tavanı DEVREDE', () => {
    const s = hesap(
      infazHesapla(
        temel({
          infazaBaslama: utc(2026, 5, 10),
          sucTarihi: utc(2024, 3, 20),
          ceza: { yil: 6, ay: 0, gun: 0 },
          tekerrur: 'birinci',
          oncekiIlam: { yil: 0, ay: 6, gun: 0 },
        })
      )
    );

    expect(sureYaz(s.ks.tekerrurEklemesi!)).toBe('1 yıl');
    expect(sureYaz(s.ks.uygulananEkleme!)).toBe('6 ay');
    expect(s.ks.tavanDevredeMi).toBe(true);
    expect(sureYaz(s.ks.infazSuresi)).toBe('3 yıl 6 ay');
    expect(s.ks.infazSuresiGun).toBe(1275);

    expect(gun(s.ksTarihi)).toBe('2029-11-05');
    expect(gun(s.ds.tarih)).toBe('2028-11-05');
  });

  it('6 ve 6b aynı BİHAKKIN tarihini verir — tekerrür cezayı uzatmaz', () => {
    const ortak = {
      infazaBaslama: utc(2026, 5, 10),
      sucTarihi: utc(2024, 3, 20),
      ceza: { yil: 6, ay: 0, gun: 0 },
      tekerrur: 'birinci' as const,
    };
    const a = hesap(infazHesapla(temel({ ...ortak, oncekiIlam: { yil: 2, ay: 0, gun: 0 } })));
    const b = hesap(infazHesapla(temel({ ...ortak, oncekiIlam: { yil: 0, ay: 6, gun: 0 } })));

    expect(gun(a.bihakkin)).toBe(gun(b.bihakkin));
    expect(gun(a.bihakkin)).toBe('2032-05-08');
    // Ama KS tarihleri farklı.
    expect(gun(a.ksTarihi)).not.toBe(gun(b.ksTarihi));
  });
});

describe('TCK 188 — araç oranı KENDİ SEÇMEZ', () => {
  it('oran verilmeden hesap yapılmaz', () => {
    expect(infazHesapla(temel({ kategori: 'uyusturucu' }))).toEqual({
      durum: 'uyusturucu-orani-gerekli',
    });
  });

  it('kullanıcının seçtiği oran uygulanır', () => {
    const ikiUc = hesap(
      infazHesapla(temel({ kategori: 'uyusturucu', uyusturucuOrani: 'ucte-iki' }))
    );
    const ucDort = hesap(
      infazHesapla(temel({ kategori: 'uyusturucu', uyusturucuOrani: 'dortte-uc' }))
    );

    expect(ikiUc.ks.oran.metin).toBe('2/3');
    expect(ucDort.ks.oran.metin).toBe('3/4');
    // Seçim sonucu doğrudan değiştiriyor — uyarı ekranının gerekçesi.
    expect(ucDort.ksTarihi.getTime()).toBeGreaterThan(ikiUc.ksTarihi.getTime());
  });
});

describe('oran tablosu', () => {
  it('terör oranı 3713 m.17 dalından gelir, m.107 tablosundan değil', () => {
    const oran = temelOran('teror');
    expect('hata' in oran).toBe(false);
    if (!('hata' in oran)) {
      expect(oran.metin).toBe('3/4');
      expect(oran.dayanak.short).toBe('3713 m.17');
    }
  });

  it('katalog ve adi suçun dayanağı m.107/2', () => {
    for (const kategori of ['adi', 'katalog'] as const) {
      const oran = temelOran(kategori);
      if (!('hata' in oran)) expect(oran.dayanak.short).toBe('5275 m.107/2');
    }
  });

  it('çakışmada YÜKSEK oran uygulanır', () => {
    const katalog = temelOran('katalog');
    const nitelikli = temelOran('nitelikli-cinsel');
    if ('hata' in katalog || 'hata' in nitelikli) throw new Error('oran alınamadı');

    // 2/3 ile 3/4 → 3/4
    expect(yuksekOran(katalog, nitelikli).metin).toBe('3/4');
    // Kesir karşılaştırması ondalığa çevrilmeden yapılıyor.
    expect(yuksekOran(nitelikli, katalog).metin).toBe('3/4');
  });

  it('katalog suç + mükerrirlik çakışırsa yüksek oran kazanır', () => {
    // Nitelikli cinsel (3/4) + birinci tekerrür (2/3) → 3/4 kalır.
    const s = hesap(infazHesapla(temel({ kategori: 'nitelikli-cinsel', tekerrur: 'birinci' })));
    expect(s.ks.oran.metin).toBe('3/4');
  });
});

describe('açığa ayrılma — EŞİK kuralı', () => {
  const ortak = {
    infazaBaslama: utc(2026, 1, 1),
    toplamCeza: { yil: 6, ay: 0, gun: 0 },
    // Eşiğin ölçüldüğü an — maddenin fotoğraf çektiği tarih.
    degerlendirmeTarihi: utc(2026, 1, 1),
  };

  it('normal tarihe 3 yıldan FAZLA kalan hükümlüye madde dokunmaz', () => {
    const sonuc = acigaAyrilma({ ...ortak, normalAcigaAyrilma: utc(2032, 1, 1) });
    expect(sonuc.durum).toBe('esige-girmiyor');
  });

  it('eşiğe girenler şartların oluştuğu tarihte ayrılır', () => {
    // Ceza 6 yıl (<10) → kapalıda 1 ay şartı: 31.01.2026.
    // Eşik: 01.01.2028 − 3 yıl = 01.01.2025 (geçmiş).
    // İkisinin sonrası → 31.01.2026.
    const sonuc = acigaAyrilma({ ...ortak, normalAcigaAyrilma: utc(2028, 1, 1) });
    expect(sonuc.durum).toBe('erken');
    if (sonuc.durum === 'erken') expect(gun(sonuc.tarih)).toBe('2026-01-31');
  });

  it('10 yıl ve üzeri cezada kapalıda kalma şartı 3 aya çıkar', () => {
    const sonuc = acigaAyrilma({
      infazaBaslama: utc(2026, 1, 1),
      toplamCeza: { yil: 10, ay: 0, gun: 0 },
      normalAcigaAyrilma: utc(2028, 1, 1),
      degerlendirmeTarihi: utc(2026, 1, 1),
    });
    expect(sonuc.durum).toBe('erken');
    if (sonuc.durum === 'erken') expect(gun(sonuc.tarih)).toBe('2026-04-01');
  });

  it('EŞİK, sabit 3 yıllık indirim DEĞİL', () => {
    // Aynı hükümlü, iki farklı değerlendirme anı. Sabit indirim olsaydı
    // ikisi de normalTarih − 3 yıl verirdi; eşik kuralında ilki hiç
    // yararlanamıyor. İlk sürümdeki hata tam olarak buydu.
    const uzak = acigaAyrilma({ ...ortak, normalAcigaAyrilma: utc(2032, 1, 1) });
    const yakin = acigaAyrilma({
      ...ortak,
      normalAcigaAyrilma: utc(2032, 1, 1),
      degerlendirmeTarihi: utc(2030, 1, 1),
    });

    expect(uzak.durum).toBe('esige-girmiyor');
    expect(yakin.durum).toBe('erken');
    if (yakin.durum === 'erken') expect(gun(yakin.tarih)).toBe('2030-01-01');
  });

  it('kapsam dışı suçlarda madde hiç uygulanmaz', () => {
    const sonuc = acigaAyrilma({
      ...ortak,
      normalAcigaAyrilma: utc(2028, 1, 1),
      kapsamDisiMi: true,
    });
    expect(sonuc.durum).toBe('kapsam-disi');
  });
});

describe('doğrulama ve sınırlar', () => {
  it('geçersiz tarih ve sıfır ceza reddedilir', () => {
    expect(infazHesapla(temel({ infazaBaslama: new Date(Number.NaN) })).durum).toBe(
      'gecersiz-tarih'
    );
    expect(infazHesapla(temel({ ceza: { yil: 0, ay: 0, gun: 0 } })).durum).toBe('gecersiz-ceza');
    expect(infazHesapla(temel({ mahsupGun: -5 })).durum).toBe('gecersiz-ceza');
  });

  it('mahsup cezadan büyükse süre negatife düşmez', () => {
    const s = hesap(infazHesapla(temel({ mahsupGun: 99_999 })));
    expect(s.ks.infazSuresiGun).toBe(0);
    expect(s.ksTarihi.getTime()).toBeGreaterThanOrEqual(utc(2026, 3, 1).getTime());
  });

  it('hiçbir tarih infaza başlamadan önce olamaz', () => {
    const s = hesap(infazHesapla(temel({ ceza: { yil: 0, ay: 2, gun: 0 } })));
    for (const t of [s.ksTarihi, s.ds.tarih, s.bihakkin]) {
      expect(t.getTime()).toBeGreaterThanOrEqual(utc(2026, 3, 1).getTime());
    }
  });

  it('ksEsigi ara adımları eksiksiz döner — sonuç ekranı bunlara dayanıyor', () => {
    const girdi = temel({ mahsupGun: 90 });
    const oran = temelOran('adi');
    if ('hata' in oran) throw new Error('oran alınamadı');
    const adim = ksEsigi(girdi, oran);

    expect(adim.hukmolunanCeza).toEqual({ yil: 5, ay: 0, gun: 0 });
    expect(adim.mahsupGun).toBe(90);
    expect(adim.kalanCeza).toEqual({ yil: 4, ay: 9, gun: 0 });
    expect(adim.oran.metin).toBe('1/2');
    expect(adim.infazSuresi).toEqual({ yil: 2, ay: 4, gun: 15 });
  });

  it('bihakkın tahliye tekerrürden etkilenmez', () => {
    const girdi = temel({ tekerrur: 'ikinci' });
    expect(gun(bihakkinTahliye(girdi))).toBe(gun(bihakkinTahliye(temel({}))));
  });
});
