# Faz E — Yayına Alma ve İzleme

CLAUDE.md Bölüm 7'deki Faz E maddelerinin çalışma belgesi. Kararlar
verildikçe buraya işlenir.

---

## 1. Google Search Console

### 1.1. Site doğrulaması — mekanizma HAZIR

`BaseLayout.astro` artık isteğe bağlı bir doğrulama etiketi basıyor:

```
PUBLIC_GOOGLE_SITE_VERIFICATION=<Search Console'un verdiği content değeri>
```

Değişken tanımlı değilse etiket hiç basılmıyor — boş bir meta etiketi
kalmıyor. Değer `.env` dosyasına ya da Cloudflare'in ortam değişkeni
paneline girilir.

> **Önerilen yöntem DNS TXT kaydı.** Alan adı Cloudflare'e bağlandıktan
> sonra Search Console'da "Alan adı" (domain property) türünü seçip TXT
> kaydı eklemek daha sağlam: site yeniden yayınlansa da bozulmaz, alt
> alan adlarını da kapsar ve `www` ile `www`suz sürümleri tek mülkte
> birleştirir. Meta etiketi yalnızca DNS'e erişilemediğinde yedek yol.

### 1.2. Sitemap — GÖNDERİME HAZIR

| Kontrol | Durum |
|---|---|
| `sitemap-index.xml` üretiliyor | ✅ |
| `robots.txt` sitemap'i işaret ediyor | ✅ `https://ocyhukuk.com/sitemap-index.xml` |
| URL sayısı | 18 (derlenen 19 sayfanın tamamı; 404 sayfası hariç — doğru) |
| Süzgeç | Kaldırıldı — dışarıda tutulacak yer tutucu sayfa kalmadı (bkz. § 3) |
| Canonical adresler | ✅ hepsi `https://ocyhukuk.com` |

Sitemap'teki adresler `ocyhukuk.com`u gösteriyor. **Alan adı bağlanmadan
Search Console'a gönderilmesi anlamsız** — Google erişemez. Sıra: alan
adı → doğrulama → sitemap gönderimi.

### 1.3. Yayın sonrası kontrol listesi

- [ ] Alan adı Cloudflare'e bağlandı, SSL aktif
- [ ] Search Console'da "Alan adı" mülkü oluşturuldu, DNS TXT ile doğrulandı
- [ ] `sitemap-index.xml` gönderildi
- [ ] "URL denetimi" ile ana sayfa ve bir çalışma alanı sayfası tarandı
- [ ] Eski blog adresleri için yönlendirme kuruldu (CLAUDE.md Faz D açık maddesi)
- [ ] `avocyhukuk.github.io` ile çakışma var mı kontrol edildi — aynı içerik iki adreste indekslenmemeli

---

## 2. Analytics — KARAR BEKLİYOR

### 2.1. Gerilim

CLAUDE.md iki şey birden istiyor: Bölüm 4/5 **sıfır JS varsayılanı** ve
Lighthouse 90+; Faz E ise **KVKK'ya duyarlı analytics**. Her analytics
betiği bu iki hedefin ilkini zedeliyor.

Şu an sitenin 16 sayfası tamamen JS'siz; yalnızca iki hesaplama aracı
betik yüklüyor. Bir analytics beacon'ı bunu **18 sayfanın tamamına**
yayar.

### 2.2. Seçenekler

| | Betik | KVKK yükü | Ne veriyor | Maliyet |
|---|---|---|---|---|
| **A. Yalnızca Search Console** | Yok | Çok düşük | Arama sorguları, gösterim, tıklama, sıra | Ücretsiz |
| **B. Cloudflare Web Analytics** | ~Beacon (her sayfa) | Düşük | Sayfa görüntüleme, yönlendiren, ülke, Core Web Vitals | Ücretsiz |
| **C. Cloudflare sunucu tarafı** | Yok | Yok | İstek sayısı, durum kodları, bant genişliği | Ücretsiz |
| **D. Kendi barındırdığımız (Umami/Plausible)** | Var | **Yüksek** | Tam kontrol | Barındırma + zaman |

**Cloudflare Web Analytics** çerez kullanmıyor, `localStorage`'a yazmıyor
ve parmak izi çıkarmıyor. Bu yüzden **çerez onay bandı gerektirmiyor** —
ama gizlilik metninde açıklanması yine de gerekiyor.

**Kendi barındırdığımız çözüm önerilmiyor:** o durumda veri sorumlusu
biz oluruz; aydınlatma metni, saklama süresi, VERBİS değerlendirmesi
gibi yükümlülükler doğar. Tek avukatlı bir büro için kazancından fazla
yük.

### 2.3. Önerim: A ile başla

**Yalnızca Search Console.** Gerekçe:

Sitenin CLAUDE.md'de yazılı amacı *"potansiyel müvekkillerin
bulabileceği, uzun kuyruk aramalarda görünür"* olmak. Bu amacın ölçüsü
**hangi aramalarda çıktığımız** — ve onu tam olarak Search Console
veriyor: sorgular, gösterim sayısı, tıklama oranı, ortalama sıra.

Sayfa görüntüleme sayısı bir tanıtım sitesinde bunun yanında ikincil
kalıyor. Sıfır JS'yi 18 sayfada korumak, öğrenilecek şeyin karşılığından
değerli görünüyor.

**Sonra ihtiyaç duyulursa B eklenir** — mekanizma hazır (`.env`'deki
`PUBLIC_ANALYTICS_TOKEN`), tek değer girip bir bileşen eklemek yetiyor.
Karar geri alınabilir; şimdi eklememek bir kapı kapatmıyor.

---

## 3. Gizlilik metni — ÇÖZÜLDÜ

Eski `public/privacy-policy.html`, bu siteyle ilgisi olmayan bir hizmeti
(WhatsApp tabanlı yapay zekâ asistanı) anlatıyordu. Av. Onur Can
Yılmaz'ın teyidiyle o hizmetin **bu projeyle ilgisi yok** — ayrı bir
projeye aitti.

**Yapılanlar:**

- `public/privacy-policy.html` ve `public/terms.html` silindi. İkisi de
  hiçbir yerden bağlantı verilmeyen yetim dosyalardı; içerikleri git
  geçmişinde duruyor.
- `astro.config.mjs`'teki sitemap süzgeci kaldırıldı — artık dışarıda
  tutulacak sayfa yok.
- Yeni sayfa: **`/gizlilik`** (`src/pages/gizlilik.astro`), altbilgiden
  bağlantılı.

**Yeni metnin söylediği** (hepsi bu sitede doğrulanabilir):

| Başlık | İçerik |
|---|---|
| Toplanmayanlar | Çerez yok · form yok · izleme kodu yok · yazı tipleri kendi sunucumuzdan |
| Hesaplama araçları | Girilen bilgiler tarayıcıdan çıkmaz, sunucuya gitmez, kaydedilmez |
| Barındırma | Cloudflare sunucu kayıtları (IP, tarih, sayfa) — dürüstçe belirtildi |
| İletişim | WhatsApp'ta Meta'nın politikası geçerli; telefon/e-posta Avukatlık Kanunu m. 36 |
| Haklar | KVKK m. 11 + başvuru adresi |

> **Bakım kuralı sayfanın koduna yazıldı:** siteye form, çerez, analytics
> veya üçüncü taraf bileşen eklenirse bu metin AYNI commit'te
> güncellenir. Aksi hâlde yine yanlış bir aydınlatma metni yayınlanmış
> olur — bu projede bir kez yaşandı.

**Kullanım koşulları sayfası yazılmadı.** Eski `terms.html` de aynı
başka projeye aitti ve silindi. Altbilgideki *"içerikler genel
bilgilendirme amaçlıdır; hukuki görüş niteliği taşımaz"* notu ile
hesaplama araçlarındaki zorunlu uyarılar şu an bu işlevi görüyor. Ayrı
bir sayfa istenirse eklenebilir.

## 4. Video alanları

CLAUDE.md Faz E'nin üçüncü maddesi: *"Video embed alanlarının gerçek
videolarla test edilmesi."*

Ana sayfa hero'sundaki `VideoSlot` yükseklik rezerveli bekliyor
(mobilde 16/9, masaüstünde 21/9, `max-height: 60vh`). Animasyon
geldiğinde bileşene yalnızca `src` verilecek; düzen değişmeyecek.
Test edilecek bir şey, video üretilene kadar yok.
