# OCY Hukuk & Danışmanlık — Web Sitesi

Av. Onur Can Yılmaz'ın hukuk bürosu için Astro ile geliştirilen, Cloudflare Pages üzerinde barındırılan statik web sitesi.

- **Canlı site:** https://ocyhukuk.com
- **Barındırma:** Cloudflare Pages
- **Framework:** [Astro](https://astro.build) + TypeScript

## Geliştirme

Bu proje ve içindeki tüm kararlar (tasarım sistemi, marka kuralları, görev listesi) için önce **[`CLAUDE.md`](./CLAUDE.md)** dosyasına bakın — Claude Code ile bu repoda çalışırken uyulması gereken tüm kurallar orada.

```bash
npm install
npm run dev       # yerel geliştirme sunucusu
npm run build     # üretim derlemesi
npm run test      # Vitest testleri (özellikle hesaplama araçları için)
npm run lint      # ESLint
```

## Proje Yapısı

Ayrıntılı klasör yapısı için `CLAUDE.md` → "Kod Organizasyonu" bölümüne bakın. Özetle:

- `src/pages/` — sayfalar/route'lar
- `src/components/` — tekrar kullanılan arayüz bileşenleri
- `src/content/` — blog yazıları ve çalışma alanı içerikleri
- `src/lib/` — hesaplama araçlarının test edilebilir mantığı
- `docs/` — destekleyici belgeler (özellikle bkz. `docs/hesaplama-formulleri.md`)

## Dağıtım (Deploy)

`main` branch'e yapılan her push, Cloudflare Pages üzerinde otomatik bir dağıtımı tetikler. Büyük değişikliklerde önce Cloudflare Pages'in oluşturduğu preview linkiyle kontrol edilmesi önerilir.

## Lisans / Gizlilik

Bu repo özel (private) bir müşteri projesidir; içeriği Av. Onur Can Yılmaz'a aittir.
