# CLAUDE.md — OCY Hukuk & Danışmanlık Web Sitesi

Bu dosya, bu repo üzerinde çalışan her Claude Code oturumunun uyması gereken kalıcı proje bağlamı, tasarım sistemi ve görev listesidir. Yeni bir oturum başlarken önce bu dosya okunmalı.

## 1. Proje Özeti

- **Kim:** Av. Onur Can Yılmaz — OCY Hukuk & Danışmanlık
- **Baro:** Ankara Barosu, Sicil No: **49834**
- **Domain:** ocyhukuk.com
- **Repo:** `avocyhukuk/avocyhukuk.github.io` (şu anki içerik bir yer tutucudur, tamamen yeniden inşa edilecek)
- **Amaç:** Potansiyel müvekkillerin bulabileceği, güven veren, SEO'ya uygun, uzun kuyruk aramalarda görünür ve hesaplama araçları içeren profesyonel bir hukuk bürosu sitesi kurmak.
- **İletişim bilgileri (NAP — tüm sayfalarda ve şemada tutarlı kullanılacak):**
  - WhatsApp / Telefon: **0537 728 43 13**
  - E-posta: **av.ocyhukuk@gmail.com**
  - Adres: Alacaatlı Mah. 5088. Cad. Relax Plus F No:74, Çankaya/Ankara
  - Hizmet dili: Türkçe (İngilizce/Gürcüce ileride ayrı bir faz olarak eklenecek — bkz. Bölüm 3)

## 2. Teknoloji Yığını

- **Framework:** Astro (statik site generator, statik çıktı → Cloudflare Workers)
- **Dil:** TypeScript
- **Kod kalitesi:** ESLint + Prettier + Vitest (test) — özellikle hesaplama araçlarının formülleri için birim testleri zorunlu
- **Barındırma:** Cloudflare Workers — statik varlık (static assets) olarak, ücretsiz plan. Yapılandırma: depo kökündeki `wrangler.jsonc`
- **Versiyon kontrolü:** Bu GitHub reposu, Cloudflare Workers Builds ile bağlı (push → otomatik deploy)

### Frontend Geliştirme Kuralı — ÖNEMLİ

Bu projede frontend/UI kodu yazılırken Anthropic'in resmi **"Frontend Design"** plugin'i kullanılmalı:

```
/plugin install frontend-design@claude-plugins-official
```

Bu plugin, jenerik/şablon görünümlü "AI tasarımı" yerine belirgin bir estetik yön seçip özenli, üretim kalitesinde arayüzler üretmeyi hedefler (kaynak: [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design)). Her yeni Claude Code oturumunda bu plugin'in kurulu/etkin olduğu kontrol edilmeli; kurulu değilse yukarıdaki komutla kurulmalı. Frontend işi yapılırken bu skill'in devreye girmesi beklenir; devreye girmiyorsa açıkça çağrılmalı.

### Kod Organizasyonu

```
src/
  pages/            → route'lar (index.astro, hakkinda.astro, iletisim.astro, calisma-alanlari/*.astro, hesaplama-araclari/*.astro)
  layouts/          → BaseLayout.astro (head/meta/OG/JSON-LD ortak iskeleti), PageLayout.astro
  components/       → Header, Footer, WhatsAppCTA, VideoSlot, CalculatorShell gibi tekrar kullanılan bileşenler
  content/          → Astro content collections: blog/ (Markdown yazılar), practice-areas/ (7 çalışma alanı verisi)
  styles/           → tokens.css (Bölüm 3'teki renk/tipografi değişkenleri), global.css
  lib/              → hesaplama araçlarının SAF fonksiyonları (UI'dan ayrı — Vitest ile test edilecek olan kısım tam olarak burası)
public/             → favicon, OG görseli, statik varlıklar
docs/               → hesaplama-formulleri.md ve diğer destekleyici dokümanlar (bkz. Bölüm 6)
```

Kural: Her hesaplama aracının matematiksel/hukuki mantığı `src/lib/` altında UI'dan bağımsız, saf (pure) fonksiyonlar olarak yazılır. Bileşen sadece bu fonksiyonu çağırıp sonucu gösterir. Bu ayrım olmadan Vitest testleri yazılamaz.

### Git & Deploy İş Akışı

- Commit mesajları kısa ve açıklayıcı, Türkçe veya İngilizce tutarlı bir dilde (ör. `feat: yatar hesaplama aracı eklendi`, `fix: mobil header taşması düzeltildi`).
- Solo proje olduğu için doğrudan `main` branch'e push edilebilir; her push Cloudflare Workers Builds'te otomatik bir deploy tetikler.
- Yeni bir hesaplama aracı veya büyük bir tasarım değişikliği gibi riskli işlerde, canlıya almadan önce önizleme sürümüyle kontrol edilmesi önerilir. `main` dışındaki dallarda Cloudflare varsayılan olarak `npx wrangler versions upload` çalıştırır ve üretime almadan bir önizleme adresi üretir.

## 3. Tasarım Sistemi (Marka Kimliği)

### Renkler

Kaynak: Av. Onur Can Yılmaz'ın kartvizit tasarımı — **sadece lacivert/krem versiyon** kullanılacak (kartvizitte gösterilen magenta varyasyonu KULLANILMAYACAK, marka kimliğinin parçası değil).

| Token | Hex | Kullanım |
|---|---|---|
| `brand-navy` | `#1B3350` | Başlıklar, navigasyon, butonlar, footer, ikonlar — otorite/vurgu rengi |
| `brand-navy-hover` | `#12233A` | Buton/link hover durumu |
| `bg-primary` | `#FAF6EC` | Ana sayfa zemini — sıcak krem, **KOYU DEĞİL** |
| `bg-secondary` | `#F1EDE1` | Bölüm ayrımı için hafif ton farkı |
| `text-primary` | `#20293A` | Gövde metni — yüksek okunabilirlik, salt siyah değil |
| `text-muted` | `#5C6577` | İkincil/soluk metin (tarih, etiket vb.) |
| `border` | `#E2E6EC` | Kenarlık/ayraç |

**Kesin kural:** Sayfaların büyük çoğunluğu açık (krem/beyaz) zemin üzerine kurulur; lacivert bir *vurgu/otorite* rengi olarak kullanılır (header, footer, butonlar), **tüm sayfa arka planı olarak kullanılmaz**. Site genel olarak "karanlık" hissettirmemeli. Metin okunabilirliği her zaman estetikten önce gelir — kontrast oranları en az WCAG AA seviyesinde olmalı.

### Tipografi

- **Başlıklar / logotype:** Kartvizitteki gibi zarif bir serif (ör. "Lora" veya "Source Serif 4", Google Fonts üzerinden)
- **Gövde metni:** Okunaklı, modern bir sans-serif (ör. "IBM Plex Sans" veya "Public Sans" — Inter/Roboto gibi aşırı kullanılmış fontlardan kaçınılacak)
- Mobilde gövde metni minimum 16px

### Logo

Kartvizitin arka yüzündeki "adalet terazisi + sütun" ikonu ve "AVUKAT Onur Can YILMAZ" logotype'ı marka logosu olarak kullanılacak. Elimizdeki görsel bir kartvizit fotoğrafı/mockup olduğundan, siteye/favicon'a koymadan önce **temiz bir SVG olarak yeniden çizilmeli** (vektörleştirilmeli) — orijinal geometri ve oranlar korunarak.

**Üretilecek görsel varlıklar (somut boyutlar):**
- `favicon.ico` (multi-size: 16x16, 32x32, 48x48)
- `apple-touch-icon.png` (180x180)
- `favicon.svg` (modern tarayıcılar için vektör favicon)
- OG paylaşım görseli `og-image.png` (1200x630) — logo + "OCY Hukuk & Danışmanlık" + slogan içeren, WhatsApp/sosyal medya önizlemesinde kullanılacak

## 4. Mimari Kurallar (Baştan Doğru Yapılmalı — Sonradan Revize Edilmeyecek)

1. **Mobil öncelikli (mobile-first) responsive tasarım zorunlu.** Her bileşen önce mobil genişlikte tasarlanıp test edilmeli, sonra tablet/masaüstüne genişletilmeli. "Sonradan mobil uyumlu hale getirme" işi yapılmayacak — baştan doğru kurulacak.
2. **Video yalnızca ana sayfa hero'sunda.** Site açıldığında ilk görülen öğe, ana sayfanın hero bölümüne eklenecek animasyondur. Diğer sayfalara video gömülmeyecektir. Bu bölümün layout'u, animasyon eklendiğinde düzenin bozulmayacağı şekilde kurulmuştur: yükseklik `aspect-ratio` ile önceden rezerve edilmiştir (mobilde 16/9, masaüstünde 21/9), üzerine `max-height: 60vh` tavanı konmuştur ki başlık ve sicil bilgisi katlamanın altında kalmasın. Animasyon geldiğinde sayfa yeniden tasarlanmayacak, yalnızca `VideoSlot`'a `src` verilecektir.
   Diğer sayfalarda video yerine, konu başlığına ilişkin **stok görseller** çalışma alanı kartlarında kullanılabilir. Kart görseli koleksiyon şemasındaki isteğe bağlı `image` alanından gelir, Astro tarafından optimize edilir ve yüksekliği yine önceden rezerve edilir. Görsel verilmeyen kart eksik görünmez.
3. **Reklam yasağına uyum zorunlu:** İkna edici/üstünlük iddiası içeren dil yok ("en iyi", "garantili sonuç" vb.), müvekkil referansı/başarı oranı paylaşımı yok. Hesaplama araçlarının sonuç ekranında "bu hesaplama tahminidir, somut olayınız için hukuki değerlendirme gereklidir" uyarısı zorunlu. Blog yazılarında da her hukuki iddia bir kanun maddesine/karara dayandırılmalı.
4. **Erişilebilirlik (a11y) temel şart:** Tüm görsellerde anlamlı `alt` metni, semantik HTML (`<nav>`, `<main>`, `<footer>` vb.), tüm interaktif öğeler (hesaplama formları dahil) klavye ile kullanılabilir, form alanlarında `<label>` eşleşmesi zorunlu.
5. **Performans hedefi:** Mevcut site çok hızlı yükleniyor (~0,5 saniye) — yeni site bu seviyeyi korumalı veya iyileştirmeli. Lighthouse Performance skoru hedefi: 90+. Gereksiz JS/kütüphane eklemekten kaçınılmalı, Astro'nun "sıfır JS varsayılan" avantajı korunmalı (hesaplama araçları gibi gerçekten interaktif olan yerler dışında).

## 5. İçerik Mimarisi (Sayfa Listesi)

- Ana Sayfa
- Hakkında (Av. Onur Can Yılmaz, Ankara Barosu Sicil No: 49834)
- İletişim
- **7 Çalışma Alanı** — her biri ayrı URL/route:
  1. Ceza Hukuku
  2. Ticaret & Şirketler Hukuku
  3. Gayrimenkul Hukuku
  4. İcra & İflas Hukuku
  5. Sigorta Hukuku
  6. Startup & Girişim Hukuku
  7. Fikri Mülkiyet Hukuku
- Blog (Markdown tabanlı yazılar, mevzuat/karar analizi formatı sürdürülür)
- Hesaplama Araçları (bir index/liste sayfası + her araç kendi sayfasında)

## 6. Hesaplama Araçları — Öncelik Sırası

1. İnfaz / Yatar Hesaplama (Ceza Hukuku)
2. Araç Değer Kaybı Hesaplama (Sigorta Hukuku)
3. Kira Artış Oranı Hesaplama (Gayrimenkul Hukuku)
4. İcra / Gecikme Faizi Hesaplama (İcra & İflas Hukuku)
5. Araç Mahrumiyet Bedeli Hesaplama (Sigorta Hukuku)
6. Dava / İcra Harç ve Masraf Hesaplama (genel)
7. Şirket Kuruluş Maliyeti Hesaplama (Startup & Girişim Hukuku)
8. Marka Tescil Süreç Takvimi (Fikri Mülkiyet Hukuku — interaktif zaman çizelgesi)

**Kural:** Her aracın dayandığı formül/kanun maddesi yayına alınmadan önce Av. Onur Can Yılmaz tarafından doğrulanmalı ve bilinen örnek davalarla test edilmeli. Sonuç ekranında dayanılan kanun maddesi açıkça gösterilmeli. Her aracın formülü ve kaynağı kodlanmadan ÖNCE `docs/hesaplama-formulleri.md` dosyasına yazılır, onaylanır, sonra `src/lib/` altında koda dökülür — bu sıra atlanmaz.

## 7. Görev Listesi (Roadmap Checklist)

### Faz A — Kurulum
- [x] Astro projesini repoda başlat (TypeScript + ESLint + Prettier + Vitest)
- [x] `.gitignore`, `README.md`, `.env.example` dosyalarının repoda olduğunu doğrula (bu teslimatla birlikte geliyor)
- [x] `/plugin install frontend-design@claude-plugins-official` ile Frontend Design plugin'ini kur
- [x] Temel layout bileşeni (header/nav/footer/WhatsApp CTA) — mobile-first kurgulanacak
- [x] Bölüm 3'teki renk/tipografi tokenlerini kod tabanında tanımla (CSS custom properties / Tailwind config vb.)
- [x] Logoyu temiz SVG olarak vektörleştir, favicon/OG görselini üret (Bölüm 3'teki boyutlarda) — *amblem `logokartvizit.png` referans alınarak yeniden çizildi, Av. Onur Can Yılmaz onayı bekliyor*

### Faz B — Temel sayfalar ve teknik SEO
- [x] Ana sayfa, Hakkında, İletişim sayfaları — *Hakkında'daki mesleki geçmiş ve eğitim `ONURCANYILMAZ-CV.pdf`ten yazıldı; metin Av. Onur Can Yılmaz'ın onayını bekliyor*
- [x] 7 çalışma alanı için ayrı sayfa/route
- [x] Meta description, Open Graph etiketleri her sayfada
- [x] JSON-LD Attorney/LegalService şeması (sicil no, adres, telefon, çalışma saatleri dahil)
- [x] `sitemap.xml`, `robots.txt`
- [ ] Gerçek cihaz genişliklerinde mobil test — *390/1024/1280 px genişliklerde render ile doğrulandı; gerçek cihazda ve JavaScript etkinken test EDİLMEDİ*

Faz B'de ayrıca yapılanlar (listede yoktu, kırık bağlantı bırakmamak için gerekliydi):
- Hesaplama araçları ve Blog için liste sayfaları (araçlar "Hazırlanıyor" olarak işaretli)
- 404 sayfası

### Faz B.5 — Cloudflare Workers'a bağlama
- [x] Cloudflare Workers'a repo bağlantısı, build ayarları — `wrangler.jsonc` (Worker adı `ocyhukuk`, varlık dizini `./dist`, `not_found_handling: "404-page"`), build komutu `npm run build`, deploy komutu `npx wrangler deploy`, Node sürümü `.nvmrc` ile 24.18.0'a sabit
- [ ] `ocyhukuk.com` özel alan adını bağlama — DNS yöntemi (nameserver taşıma / CNAME) bu adımda karara bağlanacak, MX (e-posta) kayıtlarına dokunulmayacak
- [ ] SSL doğrulama — özel alan adına bağlı; `*.workers.dev` önizlemesinde sertifika zaten hazır
- [ ] Eski site (Natro) yeni site tamamen test edilip onaylanana kadar canlı kalacak — geçiş en son adım

### Açık İş — Depoya Push

Yerel `main`, `origin/main`'in **önünde**. Push edilemedi: bu makinede GitHub kimlik bilgisi yok (`osxkeychain` yardımcısı tanımlı ama kayıt yok, SSH anahtarı yok). Push'u Av. Onur Can Yılmaz kendi terminalinden yapacak:

```bash
git push origin main
```

Kullanıcı adı `avocyhukuk`, parola yerine `repo` yetkili bir Personal Access Token (github.com/settings/tokens). İlk girişte keychain'e kaydolur. **Push tamamlandığında bu bölüm silinebilir.**

Bu gerçekleşene kadar projenin tek kopyası bu bilgisayarda.

### Faz C — Hesaplama araçları (Bölüm 6'daki sıraya göre, her biri ayrı görev)
- [ ] Yatar hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] Araç değer kaybı hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] Kira artış hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] İcra/gecikme faizi hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] Araç mahrumiyet bedeli hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] Dava/icra harç ve masraf hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] Şirket kuruluş maliyeti hesaplama — formül doğrulama → geliştirme → test → yayın
- [ ] Marka tescil süreç takvimi — geliştirme → test → yayın

### Faz D — Blog / içerik
- [ ] Mevcut blog yazılarını Markdown formatına taşı
- [ ] Yeni yazı şablonu (frontmatter, SEO alanları dahil)

### Faz E — Yayına alma ve izleme
- [ ] Google Search Console kurulumu, sitemap gönderimi
- [ ] KVKK'ya duyarlı analytics kurulumu
- [ ] Video embed alanlarının gerçek videolarla test edilmesi (videolar üretildikçe)

## 8. Reklam Yasağı / Uyum Notu

Bu dosyadaki kurallar, üçüncü taraf kaynaklardan derlenen genel TBB reklam yasağı çerçevesine göre hazırlanmıştır — Avukatlık Kanunu m.55 ve TBB Reklam Yasağı Yönetmeliği'nin güncel ve kişiye özgü yorumu için Ankara Barosu'na veya meslek kurallarına hakim bir meslektaşa danışılması önerilir. Bu belge hukuki görüş değil, geliştirme/tasarım perspektifinden hazırlanmış bir proje rehberidir.
