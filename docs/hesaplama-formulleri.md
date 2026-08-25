# Hesaplama Araçları — Formül ve Kaynak Kayıt Defteri

Bu belge, `CLAUDE.md` Bölüm 6'daki her hesaplama aracının **kodlanmadan önce** doğrulanmış formülünü ve hukuki dayanağını kayıt altına almak için var. Kural: bir araç için bu belgedeki ilgili bölüm doldurulup "Onay Durumu: Onaylandı" olarak işaretlenmeden, `src/lib/` altında o aracın kodu yazılmaz.

Her bölümdeki "Kanuni Dayanak" ve "Kaynak" alanları şu an genel araştırmadan gelen başlangıç noktalarıdır — **kesinleşmiş formül değildir**. Av. Onur Can Yılmaz tarafından doğrulanıp somut katsayı/formülle güncellenmesi gerekir.

---

## 1. İnfaz / Yatar Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun
- **Girdi alanları:** Suç türü, hükmedilen ceza süresi, mükerrerlik durumu, iyi hal, tutuklulukta geçen süre
- **Formül:** _TODO — Av. Onur Can Yılmaz tarafından doldurulacak_
- **Kaynak(lar):** _TODO_
- **Test örnekleri (bilinen 2-3 dava/senaryo ile beklenen sonuç):** _TODO_
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
