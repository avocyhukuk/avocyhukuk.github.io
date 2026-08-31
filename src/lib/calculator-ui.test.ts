import { describe, expect, it } from 'vitest';
import { uniqueReferences, type SheetRow } from './calculator-ui';

const m107: SheetRow['basis'] = {
  short: '5275 m.107/2',
  full: '5275 sayılı Kanun m. 107/2 — Koşullu salıverilme',
};

const m63: SheetRow['basis'] = {
  short: 'TCK m.63',
  full: '5237 sayılı Türk Ceza Kanunu m. 63 — Mahsup',
};

describe('uniqueReferences', () => {
  it('dayanağı olmayan satırları atlar', () => {
    const rows: SheetRow[] = [
      { label: 'Toplam ceza', value: '5 yıl' },
      { label: 'Mahsup', value: '−90 gün', basis: m63 },
    ];

    expect(uniqueReferences(rows)).toEqual([m63]);
  });

  it('aynı dayanağı bir kez döndürür', () => {
    const rows: SheetRow[] = [
      { label: 'Oran', value: '1/2', basis: m107 },
      { label: 'Kurumda geçecek süre', value: '2 yıl 6 ay', basis: m107 },
    ];

    expect(uniqueReferences(rows)).toEqual([m107]);
  });

  it('ilk görülme sırasını korur', () => {
    const rows: SheetRow[] = [
      { label: 'Mahsup', value: '−90 gün', basis: m63 },
      { label: 'Oran', value: '1/2', basis: m107 },
      { label: 'Tekrar mahsup', value: '−1 gün', basis: m63 },
    ];

    // Sıra önemli: dayanak listesi cetveldeki okuma sırasını izlemeli,
    // alfabetik veya rastgele olmamalı.
    expect(uniqueReferences(rows).map((reference) => reference.short)).toEqual([
      'TCK m.63',
      '5275 m.107/2',
    ]);
  });

  it('satır yoksa boş dizi döndürür', () => {
    expect(uniqueReferences([])).toEqual([]);
  });
});
