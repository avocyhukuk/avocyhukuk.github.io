/**
 * Hesap cetvelini istemci tarafında dolduran yardımcı.
 *
 * Neden `src/lib/` altında değil: CLAUDE.md Bölüm 2, `src/lib/`'i hesaplama
 * araçlarının SAF fonksiyonlarına ayırıyor — Vitest ile test edilen kısım
 * orası. Bu dosya DOM'a dokunuyor, dolayısıyla saf değil; karışmasın diye
 * ayrı dizinde duruyor.
 *
 * İşaretlemeyi ÜRETMİYOR: `ResultSheet.astro` içindeki `<template>`i
 * klonluyor. Böylece satır işaretlemesi ve stilleri tek kaynakta kalıyor;
 * bileşen değiştiğinde burayı güncellemek gerekmiyor.
 */
import type { LegalReference, SheetRow } from '../lib/calculator-ui';
import { uniqueReferences } from '../lib/calculator-ui';

interface SheetElements {
  rows: HTMLOListElement;
  empty: HTMLElement;
  basis: HTMLElement;
  basisList: HTMLUListElement;
  template: HTMLTemplateElement;
}

/** Cetvelin parçalarını bulur. Biri eksikse `null` döner — çağıran sessizce çıkar. */
export function findSheet(root: ParentNode = document): SheetElements | null {
  const rows = root.querySelector<HTMLOListElement>('[data-sheet-rows]');
  const empty = root.querySelector<HTMLElement>('[data-sheet-empty]');
  const basis = root.querySelector<HTMLElement>('[data-sheet-basis]');
  const basisList = root.querySelector<HTMLUListElement>('[data-sheet-basis-list]');
  const template = root.querySelector<HTMLTemplateElement>('[data-sheet-row-template]');

  if (!rows || !empty || !basis || !basisList || !template) return null;
  return { rows, empty, basis, basisList, template };
}

function fillSlot(row: HTMLElement, name: string, value: string | undefined): void {
  const slot = row.querySelector<HTMLElement>(`[data-slot="${name}"]`);
  if (!slot) return;

  if (value) {
    slot.textContent = value;
    slot.hidden = false;
  } else {
    slot.textContent = '';
    slot.hidden = true;
  }
}

function buildRow(template: HTMLTemplateElement, row: SheetRow, index: number): HTMLElement {
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const element = fragment.querySelector<HTMLElement>('.row');
  if (!element) throw new Error('Satır şablonunda .row bulunamadı');

  element.classList.toggle('row--total', row.total === true);

  const indexCell = element.querySelector<HTMLElement>('.row__index');
  if (indexCell) {
    // Kapanış satırında sıra numarası yerine eşitlik işareti: satırın bir
    // adım değil, sonuç olduğunu numaralandırmayı bozmadan söyler.
    indexCell.textContent = row.total ? '=' : String(index);
  }

  fillSlot(element, 'label', row.label);
  fillSlot(element, 'value', row.value);
  fillSlot(element, 'detail', row.detail);
  fillSlot(element, 'basis', row.basis?.short);

  return element;
}

function renderBasis(elements: SheetElements, references: readonly LegalReference[]): void {
  elements.basisList.replaceChildren();

  for (const reference of references) {
    const item = document.createElement('li');
    item.textContent = reference.full;
    elements.basisList.append(item);
  }

  elements.basis.hidden = references.length === 0;
}

/**
 * Cetveli verilen satırlarla doldurur. Boş dizi verilirse boş duruma döner —
 * form sıfırlandığında eski sonucun ekranda kalmaması için.
 */
export function renderSheet(elements: SheetElements, rows: readonly SheetRow[]): void {
  elements.rows.replaceChildren();

  // Sıra numarası yalnızca ara adımlarda ilerler; kapanış satırları
  // numaralandırmayı tüketmez.
  let step = 0;
  for (const row of rows) {
    if (!row.total) step += 1;
    elements.rows.append(buildRow(elements.template, row, step));
  }

  elements.empty.hidden = rows.length > 0;
  renderBasis(elements, uniqueReferences(rows));
}

/** Cetveli boş duruma döndürür. */
export function clearSheet(elements: SheetElements): void {
  renderSheet(elements, []);
}
