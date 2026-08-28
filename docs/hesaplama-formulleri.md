# Hesaplama Araçları — Formül ve Kaynak Kayıt Defteri

Bu belge, `CLAUDE.md` Bölüm 6'daki her hesaplama aracının **kodlanmadan önce** doğrulanmış formülünü ve hukuki dayanağını kayıt altına almak için var. Kural: bir araç için bu belgedeki ilgili bölüm doldurulup "Onay Durumu: Onaylandı" olarak işaretlenmeden, `src/lib/` altında o aracın kodu yazılmaz.

Her bölümdeki "Kanuni Dayanak" ve "Kaynak" alanları şu an genel araştırmadan gelen başlangıç noktalarıdır — **kesinleşmiş formül değildir**. Av. Onur Can Yılmaz tarafından doğrulanıp somut katsayı/formülle güncellenmesi gerekir.

---

## 1. İnfaz / Yatar Hesaplama

> **Durum: TASLAK — kodlanmadı, kodlanmayacak.** Aşağıdakiler ikincil kaynaklardan (meslektaş yayınları, güncel makaleler) derlenmiş bir başlangıç çerçevesidir. Hiçbir satırı doğrulanmış kabul edilmemelidir. Av. Onur Can Yılmaz'ın onayı olmadan `src/lib/` altına tek satır yazılmayacaktır.

### 1.1. Neden bu araç sekiz araç içindeki en riskli olan

Bunu baştan yazıyorum çünkü tasarım kararlarını bu belirliyor:

1. **Mevzuat beş yılda üç kez değişti.** 7242 s.K. (15.04.2020), 7456 s.K. (15.07.2023), 7550 s.K. — "10. Yargı Paketi" (yürürlük **04.06.2025**). Bir sonraki paket bu aracı sessizce yanlış hale getirir.
2. **Sonuç, oranla değil suç tarihiyle belirleniyor.** Aynı ceza, suçun işlendiği tarihe göre farklı infaz rejimine tabi. Kullanıcı "suç tarihi" yerine "karar tarihi" girerse sonuç sessizce yanlış çıkar.
3. **İyi hâl hesaplanamaz.** Koşullu salıverilmenin maddi şartı, idare ve gözlem kurulunun iyi hâl değerlendirmesidir (5275 m.89). Bu bir takdir yetkisidir; hiçbir formül üretemez. Araç en iyi ihtimalle **en erken olası tarihi** verir, gerçekleşecek tarihi değil.
4. **Muhatap kitlesi hassas.** Hükümlü yakınları kullanacak. Yanlış bir tarih, somut bir beklenti yaratır.

**Tasarım sonucu:** Araç bir "tahliye tarihi" vaat etmemeli; "mevcut mevzuata göre en erken olası tarih" demeli. Sonuç ekranında hem `CALCULATOR_DISCLAIMER` hem de hesabın dayandığı mevzuat sürümü ve son güncelleme tarihi görünmeli.

### 1.2. Kanuni dayanak

| Konu | Dayanak |
|---|---|
| Koşullu salıverilme (KS) oranları ve süreleri | 5275 s.K. **m.107** |
| Mükerrirlere özgü infaz rejimi | 5275 s.K. **m.108** |
| Denetimli serbestlik (DS) ile infaz | 5275 s.K. **m.105/A** |
| İyi hâl / idare ve gözlem kurulu | 5275 s.K. **m.89** |
| Gözaltı ve tutuklulukta geçen sürenin mahsubu | **TCK m.63** |
| 30.03.2020'ye kadar işlenen suçlar (DS 3 yıl) | 5275 s.K. **geçici m.6** |
| 31.07.2023'e kadar işlenen suçlar | 5275 s.K. **geçici m.10** (7456 s.K.) |
| 04.06.2025 öncesi suçlarda 1/10 şartının uygulanmaması | 5275 s.K. **geçici m.11** (7550 s.K.) |
| Terör suçlarında KS oranı | **3713 s.K. m.17** |

### 1.3. Girdi alanları (taslak)

| Alan | Tip | Neden gerekli |
|---|---|---|
| **Suç tarihi** | tarih (zorunlu) | Uygulanacak infaz rejimini bu belirler — geçici m.6 / m.10 / m.11 eşikleri. En kritik alan. |
| **Ceza türü** | seçim: süreli hapis / müebbet / ağırlaştırılmış müebbet | Müebbetlerde oran değil sabit yıl uygulanır. |
| **Ceza süresi** | yıl + ay + gün | Yalnızca süreli hapiste. |
| **Suç kategorisi** | seçim (aşağıdaki 1.4 tablosuna göre) | KS oranını belirler. |
| **Tekerrür durumu** | seçim: yok / birinci defa mükerrir / ikinci defa mükerrir | m.108 rejimi. |
| **İnfaza başlama tarihi** | tarih | Takvim hesabının başlangıcı. |
| **Mahsup edilecek süre** | gün | TCK m.63 — gözaltı + tutuklulukta geçen süre. |
| **Birden fazla ceza var mı** | evet/hayır | m.107/3 üst sınırları (28/32 yıl) devreye girer. |

**Kapsam dışı bırakılması önerilenler (ilk sürümde):** 65/70/75/80 yaş üstü ve ağır hastalık hâlinde konutta infaz (m.110), hamile/0-6 yaş çocuklu kadın hükümlüler, çocuk hükümlülere özgü indirimler. Bunlar somut olaya çok bağlı; ilk sürümde "durumunuz bu istisnalardan birine giriyorsa sonuç geçerli değildir, görüşelim" uyarısı vermek, yanlış hesaplamaktan iyidir.

### 1.4. Koşullu salıverilme oranları — derlenen tablo (DOĞRULANMALI)

**Süreli hapis:**

| Kategori | Oran |
|---|---|
| Genel kural (adi suçlar) | **1/2** |
| Kasten öldürme (TCK 81-83), neticesi sebebiyle ağırlaşmış yaralama (TCK 87/2-d), işkence-eziyet (TCK 94-96), temel cinsel suçlar (TCK 102/1, 104/1, 105), Devlet sırları-casusluk (TCK 326-339) | **2/3** |
| Örgüt kurmak/yönetmek veya örgüt faaliyeti çerçevesinde işlenen suçlar (m.107/4) | **2/3** |
| Nitelikli cinsel suçlar (TCK 102/2, 103, 104/2-3), uyuşturucu imal ve ticareti (TCK 188), terör suçları (3713 m.17) | **3/4** |
| Birinci defa mükerrir (m.108) | **2/3** |
| İkinci defa mükerrir (m.108, 7550 s.K. sonrası) | **3/4** |

**Müebbet ve ağırlaştırılmış müebbet (fiilen infaz süresi):**

| Kategori | Ağırlaştırılmış müebbet | Müebbet | Birden fazla cezada üst sınır |
|---|---|---|---|
| Genel (m.107/2-3) | 30 yıl | 24 yıl | 28 yıl |
| Örgüt suçları (m.107/4) | 36 yıl | 30 yıl | 32 yıl |
| Mükerrir (m.108) | 39 yıl | 33 yıl | 32 yıl |

> ⚠️ **Kaynaklar arasında çelişki var, çözülmeli:**
> 1. **Örgüt suçlarında süreli hapis oranı** — bir kaynak 2/3, başka bir kaynak 3/4 diyor. m.107/4'ün lafzı belirleyici.
> 2. **Uyuşturucu imal ve ticareti (TCK m.188)** — bir kaynak yetişkinler için 3/4, başka bir kaynak yalnızca "çocuklar bakımından" 2/3 diyor. İki ayrı hükmün karıştırılmış olması muhtemel.
> 3. **Mükerrir üst sınırı** — hem 32 yıl hem 39/33 yıl geçiyor; hangisinin hangi hâlde uygulandığı netleştirilmeli.

### 1.5. Denetimli serbestlik (m.105/A) — taslak

- **Standart süre:** KS tarihine **1 yıl** kala.
- **Geçici m.6:** 30.03.2020 tarihine kadar işlenen suçlarda (istisna suçlar hariç) **3 yıl**.
- **7550 s.K. ek şartı (yürürlük 04.06.2025):** Hükümlünün DS'den yararlanabilmesi için, KS tarihine kadar kurumda geçirmesi gereken sürenin **en az 1/10'unu** ve **her hâlde en az 5 günü** ceza infaz kurumunda geçirmiş olması gerekir.
- **Geçici m.11:** Bu 1/10 + 5 gün şartı, **04.06.2025'ten önce işlenen suçlara uygulanmaz.**

> ⚠️ Geçici m.6'daki 3 yıllık DS süresinin bugün hangi suçlar için hâlâ yürürlükte olduğu ve geçici m.10 ile ilişkisi netleştirilmeli. Bu iki geçici madde birbirinin üzerine biniyor.

### 1.6. Hesaplama adımları (taslak akış)

```
1. Toplam ceza süresini güne çevir.
2. Mahsup (TCK m.63) → net infaz edilecek süre.
3. Suç tarihi + suç kategorisi + tekerrür → KS oranını seç.
   · Suç tarihi hangi geçici madde eşiğinin altında/üstünde, önce bu belirlenir.
4. Kurumda geçirilecek süre:
   · süreli hapis  → net süre × KS oranı
   · müebbet       → tablodaki sabit yıl (orana bakılmaz)
5. KS tarihi         = infaza başlama tarihi + (4)
6. Bihakkın tahliye  = infaza başlama tarihi + net süre
7. DS tarihi         = KS tarihi − DS süresi (1 yıl veya 3 yıl)
   · suç tarihi ≥ 04.06.2025 ise: DS tarihi, kurumda en az (4)×1/10
     ve en az 5 gün geçirilmiş olacak şekilde ileri kaydırılır.
8. Hiçbir tarih, infaza başlama tarihinden önce olamaz (alt sınır kontrolü).
```

> ⚠️ **Çözülmemiş temel soru — süre aritmetiği.** İnfaz hesabında "1 yıl" ve "1 ay" nasıl ele alınıyor? Takvim esaslı mı (tarihe yıl/ay ekleme), yoksa 1 yıl = 365 gün / 1 ay = 30 gün sabiti mi? Bu, sonucu günler mertebesinde kaydırır ve **formülün en kritik parçasıdır** — testler de buna göre yazılacak. Bu netleşmeden kod yazılamaz.

### 1.7. Kaynaklar

Aşağıdakilerin tamamı **ikincil kaynaktır.** Birincil kaynak `mevzuat.gov.tr` üzerindeki 5275 sayılı Kanun'un güncel metnidir; bu ortamdan erişilemedi (bağlantı zaman aşımına uğruyor), doğrulamada esas alınacak metin odur.

- [5275 s.K. m.107 — Koşullu Salıverilme (Baran Doğan)](https://barandogan.av.tr/blog/mevzuat/infaz-kanunu-madde-107-kosullu-saliverilme.html)
- [Koşullu Salıverilme, 5275 m.107 (Av. Mete Şahin)](https://www.avukatmetesahin.com/post/kosullu-saliverilme-sartli-tahliye)
- [Koşullu Salıverilme 2026 — oranlar ve tablolar (Kadim Hukuk)](https://kadimhukuk.com.tr/makale/kosullu-saliverilme-sartli-tahliye-nedir/)
- [10. Yargı Paketi ile İnfaz Kanunu'nda Yapılan Değişiklikler (Haliç Avukatlık)](https://halicavukatlikdanismanlik.com/10-yargi-paketi-ile-infaz-kanununda-yapilan-degisiklikler/)
- [7550 sayılı Kanun tam metni (Alomaliye)](https://www.alomaliye.com/2025/06/04/7550-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun/)
- [7456 sayılı Kanunla Getirilen Geçici İnfaz Usulü — geçici m.10 (Ersan Şen)](https://sen.av.tr/en/makale/7456-sayili-kanunla-getirilen-gecici-infaz-usulu)
- [30.03.2020'ye kadar işlenen örgütlü suçlarda DS — geçici m.6 (Ersan Şen)](https://sen.av.tr/tr/makale/30.03.2020-tarihine-kadar-islenen-orgutlu-suclarda-denetimli-serbestlik-ve-orgutten-ayrilmanin-tespitinde-temadinin-kesilmesi-sorunu)
- [7242 s.K.'ya göre koşullu salıverilme oranları tablosu (TBB)](https://d.barobirlik.org.tr/2020/kosullusaliverilmeoranlari/3/)
- [İnfaz Kanunu m.108 — Mükerrirlere Özgü İnfaz Rejimi (Başbuğ & Zanbak)](https://basbugzanbak.av.tr/infaz-kanunu-108-madde-mukerrirlere-ozgu-infaz-rejimi-2025/)

### 1.8. Onaydan önce cevaplanması gereken sorular

1. 1.4'teki üç çelişki (örgüt oranı, TCK m.188, mükerrir üst sınırı) nasıl çözülüyor?
2. Süre aritmetiği takvim esaslı mı, 365/30 gün sabiti mi? (1.6'daki uyarı)
3. Geçici m.6 ve geçici m.10 bugün hangi suçlar için hâlâ sonuç doğuruyor?
4. Suç kategorisi listesi kullanıcıya nasıl sunulmalı — TCK madde numarasıyla mı, sade dille mi? (Yanlış kategori seçimi en olası kullanıcı hatası.)
5. 1.3'te kapsam dışı bırakılması önerilenler gerçekten dışarıda mı kalsın?

### 1.9. Test örnekleri

_TODO — 1.8'deki sorular cevaplandıktan sonra, Av. Onur Can Yılmaz'ın bildiği somut dosyalardan 3-5 senaryo ve beklenen sonuçları buraya yazılacak. Vitest testleri birebir bu senaryolardan üretilecek._

- **Onay Durumu:** ⬜ Bekliyor

## 2. Araç Değer Kaybı Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** SEDDK (Sigortacılık ve Özel Emeklilik Düzenleme ve Denetleme Kurumu) güncel genelgesi
- **Girdi alanları:** Araç yaşı, kilometre, hasar bedeli, hasar öncesi/sonrası durum
- **Formül:** _TODO_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 3. Kira Artış Oranı Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** TBK m. 344, TÜİK TÜFE 12 aylık ortalama
- **Girdi alanları:** Mevcut kira bedeli, sözleşme tarihi, güncel TÜFE oranı
- **Formül:** _TODO — TÜFE verisi aylık değiştiği için güncelleme mekanizması da not edilmeli (elle mi, otomatik API mi?)_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 4. İcra / Gecikme Faizi Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** 3095 sayılı Kanuni Faiz ve Temerrüt Faizine İlişkin Kanun, İİK ilgili maddeler
- **Girdi alanları:** Alacak tutarı, temerrüt tarihi, hesaplama tarihi, faiz türü (yasal/temerrüt/avans)
- **Formül:** _TODO_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 5. Araç Mahrumiyet Bedeli Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** _TODO_
- **Girdi alanları:** Araç sınıfı/günlük kira bedeli, mahrumiyet süresi
- **Formül:** _TODO_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 6. Dava / İcra Harç ve Masraf Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** Harçlar Kanunu, güncel Avukatlık Asgari Ücret Tarifesi
- **Girdi alanları:** Dava/takip türü, dava değeri
- **Formül:** _TODO_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 7. Şirket Kuruluş Maliyeti Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** Türk Ticaret Kanunu, güncel harç/damga vergisi tarifeleri
- **Girdi alanları:** Şirket türü (LTD/AŞ), sermaye miktarı, ortak sayısı
- **Formül:** _TODO_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 8. Marka Tescil Süreç Takvimi

- **Kanuni Dayanak (başlangıç noktası):** 6769 sayılı Sınai Mülkiyet Kanunu, TÜRKPATENT süreçleri
- **Not:** Bu bir hesap makinesi değil, interaktif bir zaman çizelgesi/aşama göstergesi olacak — "formül" yerine aşama süreleri (ör. ilan süresi 2 ay, itiraz süresi vb.) doğrulanmalı.
- **Aşama süreleri:** _TODO_
- **Kaynak(lar):** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

---

**Genel kural:** Bir araç "Onaylandı" olmadan canlıya alınmaz. Onaylanan her aracın sonuç ekranında, bu belgedeki "Kanuni Dayanak" bilgisi kullanıcıya gösterilir.
