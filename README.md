# OCY Hukuk & Danışmanlık — Web Sitesi

Av. Onur Can Yılmaz'ın hukuk bürosu için Astro ile geliştirilen, Cloudflare Workers üzerinde barındırılan statik web sitesi.

- **Canlı site:** https://ocyhukuk.com
- **Barındırma:** Cloudflare Workers (statik varlık)
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

Site, **Cloudflare Workers** üzerinde statik varlık (static assets) olarak yayımlanır. Yapılandırma depodaki `wrangler.jsonc` dosyasındadır: Worker adı `ocyhukuk`, yayımlanan dizin `./dist`.

`not_found_handling` açıkça `"404-page"` yapılmıştır. Varsayılan değer `"none"`; o hâlde bulunamayan adreslerde Cloudflare'in düz 404'ü döner ve `dist/404.html` hiç servis edilmez. Bu ayarla siteye ait 404 sayfası, doğru HTTP 404 durum koduyla birlikte gösterilir.

### Workers Builds ayarları (GitHub bağlantısı)

| Ayar              | Değer                                |
| ----------------- | ------------------------------------ |
| Build command     | `npm run build`                      |
| Deploy command    | `npx wrangler deploy` _(varsayılan)_ |
| Root directory    | _(boş — depo kökü)_                  |
| Production branch | `main`                               |

`main` dışındaki dallarda Cloudflare varsayılan olarak `npx wrangler versions upload` çalıştırır; bu, üretime almadan bir önizleme sürümü oluşturur.

### Elden dağıtım

```bash
npm run build
npx wrangler deploy          # üretime al
npx wrangler versions upload # yalnızca önizleme sürümü
```

`npx wrangler deploy --dry-run` hiçbir şey yayımlamadan yapılandırmayı ve `dist/` içeriğini doğrular.

### Node sürümü

Astro 7, Node **22.12.0 veya üzeri** ister. Workers Builds imajı varsayılan olarak 24.18.0 kullanır ve 22.23.2 ile 24.18.0 sürümlerini önceden kurulu tutar. Sürüm depoda `.nvmrc` ile `24.18.0`'a sabitlenmiştir — imajda hazır bulunduğu için ek indirme yapılmaz. Panelde ayrıca `NODE_VERSION` tanımlamaya gerek yoktur. Aynı gereksinim `package.json` içindeki `engines` alanında da yazılıdır.

Bağımlılıklar `package-lock.json` bulunduğu için `npm ci` ile kurulur; sürümler yerelde ne ise dağıtımda da odur.

### Alan adı

`astro.config.mjs` içindeki `site` değeri `https://ocyhukuk.com`. Bu, sitemap ve canonical adreslerinin üretildiği yerdir; alan adı bağlanmadan önceki `*.workers.dev` önizlemelerinde de canonical etiketler ocyhukuk.com'u gösterir. Bu bilinçlidir: önizleme adresinin arama motorunda kopya içerik olarak indekslenmesini önler.

### Geçiş notu

Depo kökündeki eski yer tutucu `index.html` kaldırılmıştır; bu depo artık GitHub Pages ile servis edilmek üzere tasarlanmamıştır. Eski site (Natro), yeni site tamamen test edilip onaylanana kadar canlı kalacaktır — alan adı geçişi en son adımdır.

## Lisans / Gizlilik

**Bu depo herkese açıktır** (`avocyhukuk/avocyhukuk.github.io`). Buraya commit'lenen her şey kalıcı olarak yayımlanır — commit'ten önce dosyanın yayımlanmasında sakınca olup olmadığı kontrol edilmelidir. Kişisel veri içeren dosyalar (ör. `ONURCANYILMAZ-CV.pdf`) `.gitignore` ile dışarıda tutulmuştur.

Sitenin içeriği Av. Onur Can Yılmaz'a aittir.
