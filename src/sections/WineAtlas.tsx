import { useEffect, useRef } from 'react';
import type { Language } from '@/i18n';
import './WineAtlas.css';

declare global {
  interface Window { d3?: unknown }
}

const atlasMarkup = `
<main>
  <div class="intro"><div><p class="eyebrow">BAĞLARIN COĞRAFYASI</p><h1>Dünya <em>Şarap Atlası</em></h1></div><p class="intro-copy">Bir ülkeye dokun.<br>Üzümlerini ve şaraplarını keşfet.</p></div>
  <div class="atlas">
    <section class="map-side" aria-label="Etkileşimli dünya haritası">
      <div class="map-toolbar"><div class="search-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg><input id="search" type="search" placeholder="Ülke ara…" aria-label="Ülke ara" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="results"><ul id="results" role="listbox" hidden></ul></div><div class="mode"><button id="explore" class="active" aria-pressed="true">Keşfet</button><button id="pan" aria-pressed="false">Taşı</button></div></div>
      <div class="map-stage" id="stage"><svg id="map" viewBox="0 0 1000 550" role="group" aria-label="Dünya ülkeleri. Ülkeleri arama alanından da seçebilirsiniz."><defs><radialGradient id="ocean"><stop stop-color="#243537"/><stop offset="1" stop-color="#10191c"/></radialGradient></defs><rect width="1000" height="550" fill="url(#ocean)"/><g id="geography"><g id="grid"></g><g id="countries"></g><g id="microstates"></g><g id="wine-regions"></g><g id="marker" pointer-events="none"></g></g></svg><div id="load-state" role="status">Harita hazırlanıyor…</div><div class="hover-card" id="hover" hidden></div><div class="region-card" id="region-card" hidden></div><div class="map-label">WORLD<br><span>WINE ATLAS</span></div><div class="zoom-tools"><button id="zoom-in" aria-label="Yakınlaştır">+</button><button id="zoom-out" aria-label="Uzaklaştır">−</button><button id="reset" aria-label="Dünya görünümüne dön"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c-5 5-5 11 0 16M12 4c5 5 5 11 0 16"/></svg></button></div><div class="position" id="position">38.96° N / 35.24° E</div></div>
      <div class="map-footer"><div class="legend"><span><i class="wine-key"></i>Şarap profili</span><span><i></i>Diğer ülkeler</span></div><span id="gesture-hint">Üzerinde gezin · Seçmek için dokun</span></div>
      <div class="quick-countries" aria-label="Ülke kısayolları"><button data-country="TUR">Türkiye</button><button data-country="FRA">Fransa</button><button data-country="ITA">İtalya</button><button data-country="USA">ABD</button><button data-country="GEO">Gürcistan</button><button data-country="ARG">Arjantin</button><button data-country="AUS">Avustralya</button></div>
    </section>
    <aside class="country-panel" aria-label="Seçilen ülkenin şarap profili"><div id="profile"></div></aside>
  </div>
  <footer class="notes"><p id="coverage">Tüm dünya · Seçilmiş şarap profilleri</p><details><summary>Harita ve içerik hakkında</summary><p>Ülke ve bölge sınırları: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a>. Bağımlı bölgeler de gösterilir; sınırlar hukuki bir görüş belirtmez. Küçük ülkeleri arama alanından seçebilirsiniz.</p><p>Şaraplar, üzüm çeşitleri ve bölgeler temsili bir seçkidir; tüm üreticilerin veya şarapların kataloğu değildir. Her profilin altında bilgi kaynağı bulunur. Profil bulunmaması, o ülkede şarap üretilmediği anlamına gelmez.</p><p>Harita: kamu malı. D3: ISC lisansı. Metinler bu atlas için özetlenmiştir.</p></details></footer>
</main>`;

function loadD3() {
  if (window.d3) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-kavust-d3]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('D3 could not load')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `${import.meta.env.BASE_URL}wine-atlas/d3.min.js`;
    script.dataset.kavustD3 = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('D3 could not load'));
    document.head.append(script);
  });
}

export default function WineAtlas({ language }: { language: Language }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    loadD3()
      .then(() => import('../wine-atlas/appInline.js'))
      .then(({ mountWineAtlas }) => { if (!cancelled) mountWineAtlas(element); })
      .catch(() => {
        const loading = element.querySelector('#load-state');
        if (loading) loading.textContent = language === 'en' ? 'The map could not load. Please refresh.' : 'Harita yüklenemedi. Lütfen sayfayı yenileyin.';
      });
    return () => { cancelled = true; };
  }, [language]);

  return <section id="wine-atlas" aria-label={language === 'en' ? 'World Wine Atlas' : 'Dünya Şarap Atlası'} className="relative w-full bg-black-deep scroll-mt-28"><div ref={root} key={language} data-lang={language} className="wine-atlas-inline" dangerouslySetInnerHTML={{ __html: atlasMarkup }} /></section>;
}
