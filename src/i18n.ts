export type Language = 'tr' | 'en';

const english: Record<string, string> = {
  'Ana Sayfa': 'Home', 'Hizmetler': 'Services', 'Hakkımda': 'About', 'Deneyim': 'Experience', 'İletişim': 'Contact',
  'Uluslararası Sommelier': 'International Sommelier', 'Hizmetin': 'The Art', 'Sanatsal Yönü': 'of Service',
  "Amerika, Dubai ve Türkiye'nin en seçkin restoranlarında edindiğim 10+ yıllık deneyimle, unutulmaz bir gastronomi yolculuğu sunuyorum.": 'With over 10 years of experience at distinguished restaurants in the United States, Dubai and Türkiye, I create unforgettable gastronomic experiences.',
  '"Şarap bir içki değil, bir hikaye anlatır."': '“Wine is not merely a drink; it tells a story.”', 'İletişime Geç': 'Get in Touch', 'Keşfet': 'Explore',
  'Uzmanlık': 'Expertise', 'Hizmet Verdiğim': 'Areas of', 'Alanlar': 'Expertise', 'Şarap Eşleştirme': 'Wine Pairing',
  'Menünüze özel kurated şarap seçkileri ve gastronomik uyum danışmanlığı. Her şişede bir hikaye, her yudumda bir deneyim.': 'Curated wine selections and gastronomic pairing guidance tailored to your menu. A story in every bottle, an experience in every sip.',
  'Fine Dining Servis': 'Fine Dining Service', 'Lüks restoran standartlarında, kusursuz masa servisi ve misafir deneyimi. Detaylarda gizli mükemmellik.': 'Impeccable table service and guest experience at luxury restaurant standards. Excellence lives in the details.',
  'Eğitim & Danışmanlık': 'Training & Consulting', 'Profesyonel ekip eğitimleri ve restoran operasyon optimizasyonu. Bilgi ve tecrübenin aktarımı.': 'Professional team training and restaurant operations optimisation. Sharing knowledge and experience.',
  'Profesyonel': 'Professional', 'Yolculuğum': 'Journey',
  'İbrahim Kavüşt, konaklama ve gastronomi sektöründe uluslararası deneyime sahip bir sommelier ve servis profesyonelidir. Kariyerini Türkiye, Dubai ve Amerika Birleşik Devletleri’nde şekillendiren Kavüşt; şarap danışmanlığı, misafir deneyimi, ekip eğitimi ve restoran operasyonları alanlarında çalışmaktadır.': 'İbrahim Kavüşt is a sommelier and service professional with international experience in hospitality and gastronomy. His career spans Türkiye, Dubai and the United States, with a focus on wine consulting, guest experience, team training and restaurant operations.',
  'Profesyonel yolculuğuna Türkiye’de turizm ve hizmet sektöründe başlayan İbrahim, Dubai’de Marriott bünyesinde çalışarak lüks misafirperverlik standartları üzerine deneyim kazandı. 2023’ten bu yana California’da The Barrel Bistro and Wine Bar’da görev alıyor; şarap servisi ve yiyecek–içecek eşleştirmelerinin yanı sıra servis kalitesinin geliştirilmesi, ekip organizasyonu ve misafir memnuniyetine odaklanıyor.': 'İbrahim began his professional journey in Türkiye’s tourism and service sector, then developed experience in luxury hospitality through Marriott in Dubai. Since 2023, he has worked at The Barrel Bistro and Wine Bar in California, focusing on wine service and food pairing, service quality, team organisation and guest satisfaction.',
  'Şaraba yaklaşımında teknik bilgiyi ulaşılabilir bir deneyimle birleştirmeyi amaçlıyor. Her misafirin damak zevkine, her menünün karakterine ve her işletmenin hedeflerine uygun çözümler üretmeye önem veriyor. Restoranlar, oteller ve hospitality projeleri için şarap programı oluşturma, ekip eğitimi, menü eşleştirmeleri ve operasyonel iyileştirme konularında destek sunuyor.': 'His approach to wine combines technical knowledge with an approachable experience. He develops solutions that respect each guest’s taste, each menu’s character and each business’s goals, supporting restaurants, hotels and hospitality projects with wine programmes, team training, menu pairings and operational improvement.',
  '"Hizmet bir sanattır ve her masada unutulmaz bir hikaye yatar."': '“Service is an art, and every table holds an unforgettable story.”', 'Eğitim': 'Education', 'Yetkinliklerim': 'Core Competencies', 'Uluslararası Deneyim': 'International Experience', 'ABD, Dubai (BAE) ve Türkiye’de profesyonel görevler': 'Professional roles in the United States, Dubai (UAE) and Türkiye', 'Ekip Yönetimi': 'Team Leadership', 'Profesyonel ekip eğitimi ve operasyonel liderlik': 'Professional team training and operational leadership',
  'Kariyer': 'Career', 'İş': 'Work', 'Deneyimim': 'Experience', 'Mevcut': 'Current',
  'Nisan 2023 - Günümüz': 'April 2023 – Present', 'Kasım 2021 - Nisan 2023': 'November 2021 – April 2023', 'Kasım 2021 - Mart 2022': 'November 2021 – March 2022', 'Temmuz 2021 - Ekim 2021': 'July 2021 – October 2021', 'Ağustos 2019 - Temmuz 2021': 'August 2019 – July 2021', 'Temmuz 2017 - Eylül 2017': 'July 2017 – September 2017',
  'Restoran operasyonlarının yönetimi, ekip koordinasyonu ve misafir deneyiminin optimize edilmesi.': 'Managing restaurant operations, coordinating teams and optimising the guest experience.', 'Marriott International bünyesinde lüks resort otelin F&B operasyonlarının yönetimi.': 'Managing F&B operations at a luxury resort hotel within Marriott International.', "Dünya Expo'sunda uluslararası misafirler için premium hizmet standartlarının uygulanması.": 'Delivering premium service standards for international guests at the World Expo.', 'Sezonluk restoran operasyonlarının tam yönetimi ve ekip liderliği.': 'Full management of seasonal restaurant operations and team leadership.', 'Fine dining restoranda masa servisi ekibinin liderliği ve misafir ilişkileri yönetimi.': 'Leading the fine-dining service team and managing guest relations.', 'Turizm sektöründe ilk deneyim ve misafir hizmetleri temelleri.': 'Early tourism-sector experience and foundations of guest service.',
  'Bir İşbirliği mi Düşünüyorsunuz?': 'Considering a Collaboration?', 'Restoran, otel veya hospitality projeleriniz için profesyonel destek almak istiyorsanız, benimle iletişime geçmekten çekinmeyin. Şarap danışmanlığı, ekip eğitimi ve operasyonel optimizasyon konularında yardımcı olmaktan memnuniyet duyarım.': 'For professional support with restaurant, hotel or hospitality projects, please feel free to get in touch. I would be pleased to help with wine consulting, team training and operational optimisation.', 'Sosyal Medya': 'Social Media', 'Benimle': 'Get', 'Adınız': 'Your Name', 'Konu': 'Subject', 'Mesajınız': 'Your Message', 'Mesaj Gönder': 'Send Message', 'Gönderiliyor...': 'Sending...', 'Mesajınız Gönderildi!': 'Your Message Has Been Sent!', 'En kısa sürede size dönüş yapacağım.': 'I will get back to you as soon as possible.', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.': 'Message could not be sent. Please try again.',
  'Tüm hakları saklıdır.': 'All rights reserved.', 'Yukarı çık': 'Back to top'
};

const reverse = Object.fromEntries(Object.entries(english).map(([tr, en]) => [en, tr]));

export function translatePage(language: Language) {
  const dictionary = language === 'en' ? english : reverse;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) nodes.push(node as Text);
  nodes.forEach((textNode) => {
    const original = textNode.nodeValue?.trim() ?? '';
    const translated = dictionary[original];
    if (translated) textNode.nodeValue = textNode.nodeValue!.replace(original, translated);
  });
  document.querySelectorAll<HTMLElement>('[placeholder]').forEach((element) => {
    const original = element.getAttribute('placeholder') ?? '';
    const translated = dictionary[original];
    if (translated) element.setAttribute('placeholder', translated);
  });
}
