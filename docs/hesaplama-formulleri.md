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

### 1.1b. v1 kapsamı — KARARA BAĞLANDI

Av. Onur Can Yılmaz'ın kapsam kararı. Bu sınır, aracın ne zaman
"bitmiş" sayılacağını belirler; genişletme talebi v2'ye yazılır.

**v1'de VAR:**

- 18 yaş üstü (yetişkin) hükümlü
- **Tek** kesinleşmiş ilam
- Standart infaz rejimi
- Çıktı: **koşullu salıverilme (KS)** ve **denetimli serbestlik (DS)** tarihleri
- Tekerrür (m.108) — mükerrir oranları ve m.108/2 tavanı dahil
- Suç kategorisine göre oranlar, mahsup, geçici madde eşikleri

**v1'de YOK — v2'ye bırakıldı:**

| Kapsam dışı | Neden buradan çıktı |
|---|---|
| **SSÇ / çocuk hükümlü** | Katsayıların neye uygulandığı (KS oranı mı, TCK m.31 ceza indirimi mi) netleşmedi; yanlış kodlamak yerine kapsam dışı bırakıldı |
| **Açık ceza infaz kurumuna geçiş tarihi** | Dayanağı kanun değil yönetmelik; 10 yıl üstü eşiği kaynaklarda 7 yıl / 5 yıl olarak çelişiyor |
| **Birden fazla ilam / içtima** | m.107/3 tavanları (28 / 32 yıl) v1'de devrede değil |
| **Konutta infaz (m.110)**, ağır hastalık/engellilik | Somut olaya çok bağlı |

**Araçta gösterilecek kapsam notu** (sonuç ekranında, uyarının yanında —
metin birebir budur):

> Bu araç 18 yaş üstü, tek kesinleşmiş ilam ve standart infaz rejimi için
> tahmini hesaplama yapar; çocuk hükümlüler ve açık cezaevine geçiş
> hesaplaması bu sürümde kapsam dışıdır.

> ⚠️ **Yoruma açık bırakılan iki alan.** "0-6 yaş çocuklu kadın hükümlü"
> ve "70 yaş üstü" hâlleri v1'de TUTULDU: ikisi de yetişkin ve standart
> rejim içinde, yalnızca DS süresini 1 yıldan 4 yıla çıkarıyorlar.
> Çıkarılsalardı araç bu kişiler için sessizce yanlış tarih verirdi.
> Kapsam dışı sayılmalarını istersen tek satırlık değişiklik.

### 1.2. Kanuni dayanak

| Konu | Dayanak |
|---|---|
| Koşullu salıverilme (KS) oranları ve süreleri | 5275 s.K. **m.107** |
| Mükerrirlere özgü infaz rejimi | 5275 s.K. **m.108** |
| Denetimli serbestlik (DS) ile infaz | 5275 s.K. **m.105/A** |
| Açık kuruma ayrılma *(v2)* | Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği |
| İyi hâl / idare ve gözlem kurulu | 5275 s.K. **m.89** |
| Gözaltı ve tutuklulukta geçen sürenin mahsubu | **TCK m.63** |
| Yaş küçüklüğü (SSÇ) *(v2)* | **TCK m.31** |
| 30.03.2020'ye kadar işlenen suçlar (DS 3 yıl) | 5275 s.K. **geçici m.6** |
| 31.07.2023'e kadar işlenen suçlar | 5275 s.K. **geçici m.10** (7456 s.K.) |
| 04.06.2025 öncesi suçlarda 1/10 şartının uygulanmaması | 5275 s.K. **geçici m.11** (7550 s.K.) |
| 31.07.2023'e kadar işlenen suçlarda 3 yıl erken DS/açık kurum | 5275 s.K. **geçici m.10/6** (7571 s.K.) |
| Terör suçlarında KS oranı | **3713 s.K. m.17** |

#### Mevzuat değişiklik zinciri

Bu aracın en büyük riski burada görünüyor — altı yılda **beş** değişiklik:

| Kanun | Tarih | Bu araca etkisi |
|---|---|---|
| **7242** | 15.04.2020 | Genel KS oranı 2/3 → **1/2**; geçici m.6 ile DS 3 yıla çıktı |
| **7456** | 15.07.2023 | Geçici m.10 — 31.07.2023 eşiği |
| **7550** (10. paket) | 04.06.2025 | m.108: ikinci defa tekerrürde KS artık mümkün (3/4); m.105/A'ya **1/10 + asgari 5 gün** şartı; geçici m.11 ile geriye yürümüyor |
| **7571** (11. paket) | 25.12.2025 | **Geçici m.10/6**: 31.07.2023 ve öncesi suçlarda açık kuruma ve DS'ye **3 yıl erken** ayrılma; en az **3 ay** açık kurumda kalmış olma şartı. *(Yeni geçici madde mi, m.10'a fıkra mı — resmî metinde teyit edilecek.)* |
| **7589** (12. paket) | 31.07.2026 | **5275'in infaz rejimine dokunmuyor.** Genel af veya infaz indirimi yok. Kontrol edildi, bu araç açısından etkisiz. |

> ⚠️ **7571'in kapsam dışı bıraktığı suçlar** (ikincil kaynaklardan): terör,
> örgüt suçları, kadına/çocuğa/eşe/üstsoy-altsoya karşı kasten öldürme,
> cinsel saldırı, çocuğun cinsel istismarı. Liste resmî metinden
> doğrulanmalı.
>
> ⚠️ Kamuoyunda bir **13. Yargı Paketi** tartışılıyor. Araç yayına
> girmeden önce yürürlüğe girerse tablolar yeniden gözden geçirilmeli.

### 1.3. Girdi alanları

| Alan | Tip | Neden gerekli |
|---|---|---|
| **Suç tarihi** | tarih (zorunlu) | Uygulanacak infaz rejimini bu belirler — 30.03.2020 / 31.07.2023 / 04.06.2025 eşikleri. En kritik alan. |
| **Ceza türü** | seçim: süreli hapis / müebbet / ağırlaştırılmış müebbet | Müebbetlerde oran değil sabit yıl uygulanır. |
| **Ceza süresi** | yıl + ay + gün | Yalnızca süreli hapiste. |
| **Suç kategorisi** | seçim — **sade dille** (bkz. 1.4 sonu) | KS oranını belirler. |
| **Tekerrür durumu** | seçim: yok / birinci defa mükerrir / ikinci defa mükerrir | m.108 rejimi. |
| **Tekerrüre esas önceki ilam cezası** | yıl + ay + gün (**opsiyonel**) | m.108/2 tavanı: eklenecek miktar, tekerrüre esas cezanın en ağırından fazla olamaz. Boş bırakılırsa tavan uygulanmaz ve sonuç hükümlü aleyhine sapabilir — bu durumda uyarı gösterilmeli. |
| **İnfaza başlama tarihi** | tarih | Takvim hesabının başlangıcı. |
| **Mahsup edilecek süre** | gün | TCK m.63 — gözaltı + tutuklulukta geçen süre. |
| **0-6 yaş çocuklu kadın hükümlü** | evet/hayır | DS süresi 1 yıl yerine 4 yıl. |
| **70 yaş üstü** | evet/hayır | DS süresi 1 yıl yerine 4 yıl. |
| **Açık kurumda en az 3 ay kaldı** | evet/hayır (**koşullu**) | Hâl C'nin (1.5) şartı. Yalnızca suç tarihi hâl C aralığına düşerse gösterilir. İşaretlenmezse hâl C uygulanmaz. |

> **Kapsam notu (1.1b).** Yaş alanı yok: araç yalnızca 18 yaş üstü için
> hesap yapıyor, SSÇ v2'ye bırakıldı. "Birden fazla ceza" alanı da yok:
> v1 tek ilam varsayıyor, m.107/3 tavanları devrede değil. Formun başında
> bu iki varsayım kullanıcıya açıkça söylenmeli — sessiz varsayım, yanlış
> sonuçtan daha kötüdür.

### 1.4. Koşullu salıverilme oranları — ONAYLANDI

Av. Onur Can Yılmaz tarafından doğrulandı; 1.4'teki üç çelişki çözüldü.

**Süreli hapis:**

| Kategori | Oran |
|---|---|
| Genel kural (adi suçlar) | **1/2** |
| Kasten öldürme (TCK 81-83), neticesi sebebiyle ağırlaşmış yaralama (TCK 87/2-d), işkence-eziyet (TCK 94-96), temel cinsel suçlar (TCK 102/1, 104/1, 105), Devlet sırları-casusluk (TCK 326-339) | **2/3** |
| Örgüt kurmak/yönetmek veya örgüt faaliyeti çerçevesinde işlenen suçlar (m.107/4) | **2/3** |
| Nitelikli cinsel suçlar (TCK 102/2, 103, 104/2-3) | **3/4** |
| Uyuşturucu imal ve ticareti (TCK 188) — suç tarihi **30.03.2020 sonrası** | **3/4** |
| Uyuşturucu imal ve ticareti (TCK 188) — suç tarihi **30.03.2020 öncesi** | **2/3** |
| Terör suçları (3713 m.17 özel düzenlemesi) | **3/4** |
| Mükerrir — süreli hapis (m.108) | **2/3** |
| İkinci defa mükerrir ve bazı katalog suçlar (m.108, 7550 s.K. sonrası) | **3/4** |

**Müebbet ve ağırlaştırılmış müebbet — kurumda geçirilecek SABİT süre:**

Bu rakamlar ceza üst sınırı değildir; koşullu salıverilmeden yararlanabilmek
için kurumda kesintisiz geçirilmesi gereken sürelerdir.

| Kategori | Ağırlaştırılmış müebbet | Müebbet |
|---|---|---|
| Genel (m.107/2) | 30 yıl | 24 yıl |
| Örgüt suçları (m.107/4) | 36 yıl | 30 yıl |
| Mükerrir (m.108) | **39 yıl** | **33 yıl** |

**Birden fazla süreli hapis cezasında tavan:**

| Kategori | Tavan |
|---|---|
| Genel (m.107/3) | 28 yıl |
| Örgüt suçları (m.107/4) | 32 yıl |
| Mükerrir (m.108) | **Sabit tavan YOK** — aşağıdaki dinamik kural geçerli |

Tavanın anlamı: cezalar toplanıp oran uygulandığında çıkan süre ne kadar
yüksek olursa olsun, kurumda geçirilecek süre tavanı aşamaz.

> ✅ **DÜZELTME — mükerrirde 32 yıl tavanı YANLIŞTI.** Önceki sürümde
> mükerrir süreli hapis için 32 yıllık sabit bir tavan yazılmıştı; bu
> hatalı. Doğrusu **m.108/2'deki dinamik kural**:
>
> > Tekerrür nedeniyle koşullu salıverilme süresine eklenecek miktar,
> > tekerrüre esas alınan cezanın **en ağırından fazla olamaz.**
>
> Yani tavan sabit bir yıl sayısı değil, tekerrüre esas önceki ilamın
> kendisi. Bu yüzden 1.3'e "tekerrüre esas önceki ilam cezası" alanı
> eklendi.
>
> **m.108/2, ikinci defa tekerrürde uygulanmaz.**
>
> 33 yıl (müebbet) ve 39 yıl (ağırlaştırılmış müebbet) ise doğru ve
> yerinde duruyor — bunlar tavan değil, kurumda geçirilecek sabit süre.

> ✅ **TCK m.188 çelişkisi çözüldü — ve sanılandan farklı bir sebepten.**
> Ayrım fıkra bazlı DEĞİL, **suç tarihi bazlı.** 188/1, 188/3, 188/4 gibi
> fıkralar arasında KS oranı farkı yok; fark 30.03.2020 eşiğinden geliyor:
> bu tarihten sonra işlenen TCK 188 suçlarında 3/4, öncesinde 2/3.
> "Bir kaynak 2/3 diyor" durumunun sebebi bu — o kaynak 2020 öncesi
> uygulamayı anlatıyor. Fıkraları tek tek ayırmaya gerek kalmadı.
>
> Önceki turdaki "yetişkin 3/4, çocuk 2/3" kaydı v1'i ilgilendirmiyor:
> araç zaten yalnızca 18 yaş üstü için hesap yapıyor. Bu ayrım v2'de,
> SSÇ ele alınırken çözülecek.

> ✅ **Oran çakışması — ÇÖZÜLDÜ.** Katalog suç oranı ile mükerrirlik
> oranı çakıştığında **yüksek olan (hükümlü aleyhine olan) oran**
> uygulanır. Örnek: TCK m.188 (3/4) + birinci defa mükerrir (2/3) → **3/4**.
>
> Kodda sonucu tek satır: `oran = max(katalogOrani, mukerrirlikOrani)`.
> İkinci defa tekerrür zaten 3/4 olduğu için aynı kural onu da kapsıyor.

### 1.5. Denetimli serbestlik (m.105/A) — ONAYLANDI

**Temel süre:**

| Durum | DS süresi |
|---|---|
| Standart | KS tarihine **1 yıl** kala |
| **0-6 yaş çocuklu kadın hükümlü** | **4 yıl** |
| **70 yaş üstü hükümlü** | **4 yıl** |

**Ek şart (7550 s.K., yürürlük 04.06.2025):** Hükümlünün DS'den
yararlanabilmesi için, KS tarihine kadar kurumda geçirmesi gereken sürenin
**en az 1/10'unu** ve **her hâlde en az 5 günü** ceza infaz kurumunda
geçirmiş olması gerekir. **Geçici m.11:** bu şart 04.06.2025'ten önce
işlenen suçlara uygulanmaz.

#### Geçici maddelerin birleşimi — ÇÖZÜLDÜ

> **Süreler TOPLANMAZ.** Türk ceza adalet sisteminde infaz sürelerinde
> kümülatif indirim mantığı yoktur. Geçici maddeler üst üste bindiğinde,
> TCK m.7'deki **lehe kanun** ilkesi uyarınca hükümlüye en erken tahliyeyi
> veren kombinasyon uygulanır ("karma uyum").

Suç tarihine ve geçici m.6 istisnası olup olmadığına göre üç hâl:

| Hâl | Koşul | DS süresi |
|---|---|---|
| **A** | 30.03.2020 öncesi işlenmiş **ve** geçici m.6 istisnası **değil** | **3 yıl** — doğrudan geçici m.6 rejimi. m.10/6'nın 3 yıllık erkenliği AYRICA EKLENMEZ. |
| **B** | 30.03.2020 öncesi işlenmiş **ama** geçici m.6 istisnası, buna karşın geçici m.10/6 kapsamında | **1 + 3 = 4 yıl** |
| **C** | Yalnızca geçici m.10/6 kapsamında (30.03.2020 – 31.07.2023 arası işlenmiş) | **1 + 3 = 4 yıl**, açık kurumda en az **3 ay** kalmış olmak şartıyla |

Hâl A'da koşullu salıverilme oranı da (istisnalar hariç) 1/2'dir — bu
zaten 7242 sonrası genel kural, ayrı bir dal gerektirmiyor.

Uygulamada infaz hâkimlikleri her dosya için ayrı müddetname düzenleyip
en erken tahliye tarihini veren maddeyi uygular. Aracın yaptığı da bu:
uygulanabilir hâlleri hesaplayıp **en erken tarihi** seçmek.

> ✅ **İki uygulama kararı — ONAYLANDI.**
>
> **1. DS çakışmasında en erken tarih seçilir.** 0-6 yaş çocuklu kadın
> veya 70+ hükümlü zaten 4 yıl DS alıyor; aynı kişi hâl B/C kapsamına da
> giriyorsa süreler toplanmaz. Uygulanabilir her hâl ayrı ayrı hesaplanır
> ve **en erken DS tarihini veren** sonuç seçilir. "Toplanmaz, lehe olan
> uygulanır" ilkesinin kodda karşılığı budur.
>
> Kodda: `dsTarihi = min(...uygulanabilirHallerinTarihleri)`
>
> **2. "Açık kurumda en az 3 ay" formda sorulur.** Bu bir vakıa; araç
> hesaplayamaz. Hâl C'de forma bir onay kutusu konur:
> *"Açık ceza infaz kurumunda en az 3 ay kaldı"*. İşaretlenmezse hâl C
> uygulanmaz ve sonuç standart rejime göre verilir. Sessiz varsayım
> yapılmaz — hâl C'yi varsaymak tarihi 3 yıl erkene kaydırırdı.
>
> Onay kutusu yalnızca hâl C'nin devreye girebileceği suç tarihi
> aralığında gösterilir; diğer hâllerde formda yer kaplamaz.

### 1.6. Sonuç ekranı — üç tarih birlikte

Cetvel şu üçünü aynı anda göstermeli. (Açık kuruma geçiş dördüncü satır
olacaktı; v1 kapsamı dışına alındı — bkz. 1.1b.)

| Satır | Ne | Dayanak |
|---|---|---|
| 1 | **Koşullu salıverilme tarihi** | 5275 m.107 / m.108 |
| 2 | **Denetimli serbestlik başlangıcı** ve süresi | 5275 m.105/A |
| 3 | **Bihakkın (hak ederek) tahliye tarihi** | Cezanın tamamı |

Bu üçünün altında, `CALCULATOR_DISCLAIMER` ile birlikte 1.1b'deki
**kapsam notu** da görünecek.

### 1.7. Hesaplama adımları (taslak akış)

```
1. Toplam ceza süresini güne çevir  (1 yıl = 365, 1 ay = 30)
2. Mahsup (TCK m.63) → net infaz edilecek süre
3. Suç tarihi eşiklerini belirle: 30.03.2020 / 31.07.2023 / 04.06.2025
4. Suç kategorisi + tekerrür → KS oranını seç
   · çakışma hâlinde YÜKSEK oran (bkz. 1.4 sonu)
5. Kurumda geçirilecek süre:
   · süreli hapis  → net süre × KS oranı
   · müebbet       → tablodaki sabit yıl (orana bakılmaz)
   · mükerrir + önceki ilam verilmişse → m.108/2 tavanını uygula
6. KS tarihi          = infaza başlama + (5)
7. Bihakkın tahliye   = infaza başlama + net süre
8. DS başlangıcı:
   · uygulanabilir her hâl için ayrı tarih hesapla
     (standart 1 yıl · 4 yıl özel durum · hâl A 3 yıl · hâl B/C 4 yıl)
   · hâl C yalnızca "açık kurumda 3 ay" onay kutusu işaretliyse dahil edilir
   · DS tarihi = bu tarihlerin EN ERKENİ (süreler toplanmaz)
   · suç tarihi ≥ 04.06.2025 ise kurumda en az (5)×1/10 ve en az 5 gün
     geçmiş olacak şekilde ileri kaydır
9. Hiçbir tarih infaza başlama tarihinden önce olamaz (alt sınır kontrolü)
```

> ✅ **Süre aritmetiği — ONAYLANDI ve ÖRNEKLE TEYİT EDİLDİ.** İnfaz
> hesabında süreler tamamen güne çevrilir: **1 yıl = 365 gün, 1 ay = 30
> gün.** Takvim esaslı hesap YAPILMAZ.
>
> Teyit: rakip araçlarda 5 yıllık ceza **1825 gün** olarak işleniyor
> (5 × 365 = 1825, tam bölünüyor). Artık yıl farkı yok — yani gerçek
> takvim kullanılmıyor, sabit konvansiyon kullanılıyor.
>
> Kodda sonucu: `toplamGun = yil * 365 + ay * 30 + gun`. Tarihler bu gün
> sayısının infaza başlama tarihine eklenmesiyle bulunur.

### 1.8. Kaynaklar

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
- [11. Yargı Paketi Resmî Gazete'de — 7571 s.K. (Sanal Hukuk)](https://sanalhukuk.org/2025/12/25/11-yargi-paketi-resmi-gazetede-yayimlandi-31-temmuz-infaz-duzenlemesi/)
- [11. Yargı Paketi duyurusu (TBB)](https://www.barobirlik.org.tr/Haberler/kamuoyunda-11-yargi-paketi-olarak-adlandirilan-kanun-resmi-gazetede-yayimlanmistir-86169)
- [12. Yargı Paketi — 7589 s.K. neleri değiştirdi (Büken)](https://buken.av.tr/12-yargi-paketi-7589-sayili-kanun/)
- [TCK 188 fıkraları ve infaz oranları (Ulus Hukuk)](https://ulus.av.tr/tck-188/)

**Rakip araç incelemesi (Av. Onur Can Yılmaz, beş araç):** kadimhukuk,
kararara, dcahukuk, ayboga, topaktas. Bu araçlar 365 gün
konvansiyonunun ve v2'ye bırakılan açık kurum tablosunun kaynağı. **Rakip aracın çıktısı
kaynak değildir** — yalnızca resmî metinde neye bakılacağını gösterir.

### 1.9. Onay durumu

**✅ Formülün tamamı kapandı — açık hukuki soru kalmadı.**

| Konu | Cevap |
|---|---|
| Örgüt suçlarında süreli hapis oranı | 2/3 (m.107/4); terör 3713 m.17 gereği 3/4 |
| TCK m.188 | Ayrım **fıkra değil tarih** bazlı: 30.03.2020 sonrası 3/4, öncesi 2/3 |
| Mükerrir 33/39 yıl | Müebbet 33, ağırlaştırılmış müebbet 39 (sabit süre) |
| Mükerrir "32 yıl tavan" | Yanlıştı, kaldırıldı — m.108/2 dinamik kuralı geçerli |
| Süre aritmetiği | 1 yıl = 365, 1 ay = 30 — örnekle teyit edildi |
| Suç kategorisi sunumu | Sade dil |
| 7571 (11. paket) | Geçici m.10/6 — belgeye işlendi |
| 7589 (12. paket) | 5275'e dokunmuyor — etkisiz |
| v1 kapsamı | Karara bağlandı (1.1b) |
| **Geçici maddelerin birleşimi** | **Toplanmaz** — lehe olan / karma uyum; hâl A/B/C tablosu (1.5) |
| **Oran çakışması** | **Yüksek oran uygulanır** — `max(katalog, mükerrirlik)` |

**⬜ Yayın için kalan üç adım:**

1. **Test senaryolarının beklenen tarihleri** (1.10) — girdi tarafı
   dolduruldu (24 senaryo), beklenen dört tarih boş. Mevzuat kontrolü
   sonrası birlikte hesaplanacak.
2. **Resmî metin kontrolü** (1.12) — `mevzuat.gov.tr` üzerinden.
3. **Onay Durumu'nun "Onaylandı"ya çevrilmesi** — bundan sonra kod yazılır.

1.5'teki iki uygulama kararı (DS çakışmasında en erken tarih, "açık
kurumda 3 ay" için onay kutusu) **onaylandı** ve belgeye işlendi.

### 1.10. Test senaryoları — v1 çekirdek

**Girdi tarafı dolduruldu. Beklenen tarihler BİLİNÇLİ OLARAK BOŞ** —
mevzuat kontrolü bitince Av. Onur Can Yılmaz ile birlikte hesaplanıp
doldurulacak, sonra Vitest fikstürüne çevrilecek.

Senaryolar tek tek bir dalı zorlamak için seçildi; "gerçekçi dosya"
olmaları değil, **kapsama** amaçlanıyor. Hepsi v1 kapsamında: 18 yaş
üstü, tek ilam.

Kısaltmalar: **T** = tekerrür, **M** = mahsup (gün), **İB** = infaza
başlama.

#### Temel dallar

| # | Suç tarihi | Ceza | Kategori | T | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|
| 1 | 10.09.2024 | 5 yıl | Adi suç | yok | 01.03.2026 | 0 | En sade hâl: oran 1/2, DS standart 1 yıl, 1/10 şartı yok |
| 2 | 10.09.2024 | 5 yıl | Adi suç | yok | 01.03.2026 | 90 | TCK m.63 mahsup dalı (1 numaradan tek farkı bu) |
| 3 | 15.11.2024 | 18 yıl | Kasten öldürme (TCK 81) | yok | 20.01.2026 | 240 | Katalog oran 2/3 |
| 4 | 05.06.2021 | 10 yıl | Uyuşturucu ticareti (TCK 188) | yok | 12.04.2026 | 150 | TCK 188 → 3/4 (suç tarihi 30.03.2020 sonrası) **ve** DS hâl C |
| 5 | 12.01.2019 | 10 yıl | Uyuşturucu ticareti (TCK 188) | yok | 03.02.2026 | 0 | Aynı suç, 30.03.2020 **öncesi** → 2/3. Tarih bazlı ayrımı doğrular |

#### Tekerrür ve oran çakışması

| # | Suç tarihi | Ceza | Kategori | T | Önceki ilam | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|---|
| 6 | 20.03.2024 | 6 yıl | Adi suç (hırsızlık) | 1. defa mükerrir | 2 yıl | 10.05.2026 | 0 | Mükerrir oranı 2/3 **ve** m.108/2 tavanı |
| 7 | 08.02.2024 | 12 yıl | Uyuşturucu ticareti (TCK 188) | 1. defa mükerrir | 3 yıl | 01.06.2026 | 0 | **Oran çakışması**: max(3/4, 2/3) = 3/4 |
| 8 | 19.05.2024 | 9 yıl | Adi suç | 2. defa mükerrir | — | 15.07.2026 | 60 | İkinci tekerrür 3/4; m.108/2 tavanı UYGULANMAZ |

#### Denetimli serbestlik hâlleri (1.5 tablosu)

| # | Suç tarihi | Ceza | Kategori | Özel durum | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|
| 9 | 18.06.2018 | 7 yıl | Adi suç | — | 04.02.2026 | 0 | **Hâl A**: geçici m.6 → DS 3 yıl, erkenlik eklenmez |
| 10 | 22.02.2022 | 6 yıl | Adi suç | açık kurumda 3 ay: **evet** | 08.03.2026 | 0 | **Hâl C**: DS 1+3 = 4 yıl |
| 11 | 22.02.2022 | 6 yıl | Adi suç | açık kurumda 3 ay: **hayır** | 08.03.2026 | 0 | 10 ile aynı, kutu işaretsiz → hâl C uygulanmaz, standart 1 yıl |
| 12 | 14.10.2024 | 8 yıl | Adi suç | 70 yaş üstü | 20.02.2026 | 0 | DS 4 yıl |
| 13 | 25.12.2024 | 4 yıl | Adi suç | 0-6 yaş çocuklu kadın | 11.03.2026 | 0 | DS 4 yıl |
| 14 | 22.02.2022 | 6 yıl | Adi suç | 70 yaş üstü + açık kurumda 3 ay: evet | 08.03.2026 | 0 | **DS çakışması**: 4 yıl ile hâl C birlikte → en erken tarih seçilmeli, süreler toplanmamalı |

#### 7550 şartı (1/10 + asgari 5 gün)

| # | Suç tarihi | Ceza | Kategori | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|
| 15 | 15.09.2025 | 3 yıl | Adi suç | 02.02.2026 | 0 | Suç tarihi 04.06.2025 **sonrası** → 1/10 şartı devrede |
| 16 | 15.09.2025 | 3 ay | Adi suç | 05.01.2026 | 0 | 1/10 hesabı 5 günün altına düşüyor → **asgari 5 gün tabanı** devreye girer |
| 17 | 20.05.2025 | 3 yıl | Adi suç | 02.02.2026 | 0 | Suç tarihi 04.06.2025 **öncesi** → geçici m.11, şart uygulanmaz (15 ile karşılaştırmalı) |

#### Müebbet ve ağırlaştırılmış müebbet

| # | Suç tarihi | Ceza | Kategori | T | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|
| 18 | 11.11.2024 | Müebbet | Kasten öldürme | yok | 03.03.2026 | 420 | Sabit 24 yıl; orana bakılmaz |
| 19 | 02.05.2024 | Ağırlaştırılmış müebbet | Nitelikli kasten öldürme | yok | 15.09.2026 | 300 | Sabit 30 yıl |
| 20 | 07.07.2024 | Müebbet | Kasten öldürme | 1. defa mükerrir | 01.10.2026 | 0 | Mükerrir müebbet → 33 yıl |
| 21 | 07.07.2024 | Ağırlaştırılmış müebbet | Nitelikli kasten öldürme | 1. defa mükerrir | 01.10.2026 | 0 | Mükerrir ağ. müebbet → 39 yıl |

#### Eşik günü sınır testleri

Bu üçü, "tarihe kadar" ifadesinin o günü **içerip içermediğini** ayırmak
için var. Resmî metin kontrolünde özellikle bakılmalı: eşik günü hangi
tarafa düşüyor?

| # | Suç tarihi | Ceza | Kategori | İB | Neyi doğrular |
|---|---|---|---|---|---|
| 22 | 30.03.2020 | 5 yıl | Adi suç | 01.04.2026 | Geçici m.6 eşiğinin tam günü |
| 23 | 31.07.2023 | 5 yıl | Adi suç | 01.04.2026 | Geçici m.10/6 eşiğinin tam günü |
| 24 | 04.06.2025 | 3 yıl | Adi suç | 01.04.2026 | 7550 / geçici m.11 eşiğinin tam günü |

#### Doldurulurken dikkat

- **4 ve 5 numara aynı suçu farklı tarihlerde** kullanıyor; ikisinin
  oranı farklı çıkmazsa tarih bazlı ayrım yanlış kodlanmış demektir.
- **10 ve 11 numara yalnızca onay kutusunda ayrılıyor**; sonuçları aynı
  çıkarsa kutu hiç okunmuyor demektir.
- **14 numara en kritik senaryo**: süreler toplanırsa 7 yıl çıkar,
  doğru davranışta 4 yıl çıkmalı.
- **Uyuşturucu ticaretinin geçici m.6 istisnası olup olmadığı**
  netleşmeli — 5 numaranın DS hâli buna bağlı (hâl A mı, hâl B mi).
- Her senaryoda hangi rakip aracın hangi sonucu verdiği not edilirse,
  araçlar çeliştiğinde hangisinin resmî metinle uyuştuğu ayırt edilebilir.

**Teyit edilmiş tek veri noktası:** 5 yıllık ceza = **1825 gün**
(5 × 365) — 365 gün konvansiyonunu doğruluyor (bkz. 1.7).

### 1.11. v2 senaryoları — şimdilik toplanmayacak

SSÇ (çocuk hükümlü) ve açık cezaevine geçiş senaryoları v1 kapsamı
dışında (bkz. 1.1b). v2 açıldığında bu başlık altında toplanacak;
şu an boş bırakılması bilinçlidir — v1 fikstürüne karışmasınlar.

### 1.12. Kapanmadan önce yapılacak son kontrol

Onay, `mevzuat.gov.tr` üzerindeki **resmî metinle** yapılacak. Kontrol
listesi:

- [ ] m.107 tam metni — 1.4'teki oran tablosunun her satırı
- [ ] m.107/4 örgüt oranı (2/3 olarak işaretlendi, teyit bekliyor)
- [ ] m.108 tam metni — 33/39 yıl ve m.108/2'nin lafzı
- [ ] m.105/A tam metni — 1/10 + 5 gün şartı
- [ ] TCK m.188 — tarih bazlı ayrımın doğrulanması
- [ ] Geçici m.6, m.10/6, m.11 — hâl A/B/C tablosunun (1.5) doğrulanması
- [ ] 7571 yeni bir geçici madde mi ekledi, yoksa m.10'a 6. fıkra mı
- [ ] m.107/m.108 çakışmasında yüksek oranın uygulandığının teyidi
- [ ] 13. Yargı Paketi yürürlüğe girdi mi

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
