export function mountWineAtlas(root) {
  const $ = (s) => root.querySelector(s);
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const d3lib = window.d3;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const atlasBase = `${import.meta.env.BASE_URL}wine-atlas/`;
  const lang = root.dataset.lang === 'en' ? 'en' : 'tr';
  const en = lang === 'en';
  const continents = { Asia: 'Asya', Europe: 'Avrupa', Africa: 'Afrika', 'North America': 'Kuzey Amerika', 'South America': 'Güney Amerika', Oceania: 'Okyanusya', Antarctica: 'Antarktika', 'Seven seas (open ocean)': 'Okyanus adaları' };
  const copy = en ? {
    'Öne çıkan üzümler': 'Signature grapes', 'Şarap bölgeleri': 'Wine regions', 'Şarapları tanı': 'Discover the wines',
    'Üzümler & şaraplar': 'Grapes & wines', 'Ülke bilgisi': 'Country information',
    'Sürükle · Dünya döner': 'Drag · Rotate the world', 'Üzerinde gezin · Seçmek için dokun': 'Hover · Tap to select',
    'Eşleşen ülke bulunamadı.': 'No matching country found.', 'Türkiye profilini aç': 'Open the Turkey profile',
    'Bu ülke veya bölge için henüz doğrulanmış bir şarap profili eklenmedi. Bu, burada şarap üretilmediği anlamına gelmez.': 'A verified wine profile has not yet been added for this country or region. This does not mean wine is not produced here.',
    'Keşfe devam et': 'Continue exploring', 'Altın tonundaki ülkelerde üzüm çeşitlerini, bölgeleri ve şarap stillerini inceleyebilirsin.': 'Explore grape varieties, regions and wine styles in the countries highlighted in gold.',
    'Kaynak ve ayrıntılı okuma ↗': 'Source & further reading ↗'
  } : {};
  const t = (value) => copy[value] || value;
  const countryNames = en ? { Türkiye: 'Turkey', ABD: 'United States', Gürcistan: 'Georgia' } : {};
  const regionalWineMap = {
    FRA: [['Bordeaux', [-0.58, 44.84], ['Bordeaux blends', 'Cabernet Sauvignon & Merlot']], ['Bourgogne', [4.84, 47.05], ['Pinot Noir', 'Chardonnay']], ['Champagne', [4.03, 49.26], ['Champagne', 'Traditional-method sparkling wine']], ['Loire', [0.1, 47.3], ['Sauvignon Blanc', 'Chenin Blanc']], ['Rhône', [4.8, 44.2], ['Syrah', 'Grenache blends']], ['Alsace', [7.35, 48.1], ['Riesling', 'Gewürztraminer']]],
    ITA: [['Piemonte', [8.05, 44.7], ['Barolo', 'Barbaresco']], ['Toscana', [11.2, 43.5], ['Chianti Classico', 'Brunello di Montalcino']], ['Veneto', [11.9, 45.5], ['Prosecco', 'Amarone']], ['Sicilia', [14.0, 37.5], ['Nero d’Avola', 'Etna wines']]],
    TUR: [['Trakya', [27.0, 41.0], ['Cabernet blends', 'Papazkarası']], ['Ege', [27.0, 38.2], ['Bornova Misketi', 'Syrah']], ['Kapadokya', [34.7, 38.6], ['Emir', 'Narince']], ['Elazığ', [39.2, 38.7], ['Öküzgözü', 'Boğazkere']]],
    USA: [['Napa Valley', [-122.3, 38.5], ['Cabernet Sauvignon', 'Chardonnay']], ['Sonoma', [-122.9, 38.4], ['Pinot Noir', 'Zinfandel']], ['Willamette Valley', [-123.1, 45.3], ['Pinot Noir', 'Chardonnay']], ['Finger Lakes', [-76.8, 42.7], ['Riesling', 'Cabernet Franc']]],
    ESP: [['Rioja', [-2.5, 42.5], ['Tempranillo', 'Reserva reds']], ['Ribera del Duero', [-3.7, 41.6], ['Tempranillo', 'Crianza reds']], ['Rías Baixas', [-8.6, 42.4], ['Albariño', 'Atlantic whites']], ['Jerez', [-6.1, 36.7], ['Fino', 'Oloroso Sherry']]],
    PRT: [['Douro', [-7.8, 41.2], ['Port', 'Douro reds']], ['Vinho Verde', [-8.4, 41.7], ['Vinho Verde', 'Alvarinho']], ['Dão', [-7.9, 40.5], ['Touriga Nacional', 'Encruzado']]],
    ARG: [['Mendoza', [-69.1, -32.9], ['Malbec', 'Cabernet Sauvignon']], ['Uco Valley', [-69.3, -33.7], ['High-altitude Malbec', 'Chardonnay']], ['Salta', [-65.4, -24.8], ['Torrontés', 'Malbec']]],
    CHL: [['Maipo', [-70.7, -33.6], ['Cabernet Sauvignon', 'Carménère']], ['Colchagua', [-71.1, -34.6], ['Carménère', 'Syrah']], ['Casablanca', [-71.4, -33.3], ['Sauvignon Blanc', 'Chardonnay']]],
    AUS: [['Barossa Valley', [139.0, -34.5], ['Shiraz', 'Grenache']], ['Margaret River', [115.1, -33.9], ['Cabernet Sauvignon', 'Chardonnay']], ['Hunter Valley', [151.3, -32.8], ['Semillon', 'Shiraz']]],
    NZL: [['Marlborough', [173.8, -41.5], ['Sauvignon Blanc', 'Pinot Noir']], ['Central Otago', [169.2, -45.0], ['Pinot Noir', 'Riesling']], ['Hawke’s Bay', [176.8, -39.6], ['Syrah', 'Bordeaux blends']]],
    DEU: [['Mosel', [6.9, 49.9], ['Riesling', 'Spätlese']], ['Rheingau', [8.1, 50.0], ['Riesling', 'Spätburgunder']], ['Pfalz', [8.1, 49.3], ['Riesling', 'Pinot Noir']]],
    ZAF: [['Stellenbosch', [18.86, -33.94], ['Cabernet Sauvignon', 'Chenin Blanc']], ['Swartland', [18.77, -33.4], ['Syrah', 'Chenin Blanc']], ['Constantia', [18.45, -34.03], ['Vin de Constance', 'Sauvignon Blanc']]]
  };

  let countries = [], land = null, wineFeatures = [], profiles = {}, byId = new Map(), selected = 'TUR', hovered = null;
  let canvas, ctx, projection, path, graticule, width = 1000, height = 550, dpr = 1;
  let rotation = [-31, -26, 0], zoomLevel = 1.08, targetRotation = null, targetZoom = null;
  let dragging = false, start = null, moved = false, stageVisible = true, lastFrame = performance.now(), lastDraw = 0, resumeAt = 0, animationId = 0;

  function name(f) {
    const value = f.properties.id === 'TUR' ? 'Türkiye' : f.properties.tr || f.properties.name;
    return countryNames[value] || value;
  }
  function fold(s) { return s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i'); }
  function visible(lngLat) {
    const center = [-rotation[0], -rotation[1]];
    return d3lib.geoDistance(lngLat, center) < Math.PI / 2;
  }
  function countryAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const point = [(clientX - rect.left) * (width / rect.width), (clientY - rect.top) * (height / rect.height)];
    const lngLat = projection.invert(point);
    if (!lngLat || !Number.isFinite(lngLat[0]) || !visible(lngLat)) return null;
    let match = null;
    for (const f of countries) if (d3lib.geoContains(f, lngLat)) { match = f; break; }
    return match;
  }
  function updatePosition(f) {
    const [lng, lat] = f.properties.point;
    $('#position').textContent = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} / ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`;
  }
  function showHover(f, event) {
    hovered = f?.properties.id || null;
    const box = $('#hover');
    if (!f) { box.hidden = true; draw(); return; }
    box.innerHTML = `${escapeHTML(name(f))}<small>${profiles[f.properties.id] ? t('Üzümler & şaraplar') : t('Ülke bilgisi')}</small>`;
    box.hidden = false;
    const stage = $('#stage').getBoundingClientRect();
    const boxWidth = box.offsetWidth;
    box.style.left = `${Math.max(8, Math.min(stage.width - boxWidth - 8, event.clientX - stage.left + 12))}px`;
    box.style.top = `${Math.max(8, Math.min(stage.height - 68, event.clientY - stage.top - 58))}px`;
    draw();
  }
  function showRegion(region, point) {
    const card = $('#region-card');
    card.innerHTML = `<strong>${escapeHTML(region[0])}</strong><span>${region[2].map(escapeHTML).join(' · ')}</span>`;
    card.hidden = false;
    const stage = $('#stage').getBoundingClientRect();
    const w = card.offsetWidth;
    card.style.left = `${Math.max(8, Math.min(stage.width - w - 8, point[0] + 12))}px`;
    card.style.top = `${Math.max(8, Math.min(stage.height - 70, point[1] - 58))}px`;
  }
  function renderProfile(f) {
    const p = profiles[f.properties.id], code = f.properties.iso;
    const top = `<div class="profile-top"><span>${escapeHTML(en ? f.properties.continent : (continents[f.properties.continent] || f.properties.continent))}</span><span class="country-code">${escapeHTML(code === '-99' ? f.properties.id : code)}</span></div><h2>${escapeHTML(name(f))}</h2>`;
    let body;
    if (p) {
      body = `<p class="profile-summary">${escapeHTML(p.summary)}</p><section class="profile-section"><h3 class="section-label">${t('Öne çıkan üzümler')}</h3><div class="grapes">${p.grapes.map((g) => `<span class="grape ${g.color === 'r' ? 'red' : ''}"><i aria-hidden="true"></i>${escapeHTML(g.name)}</span>`).join('')}</div></section><section class="profile-section"><h3 class="section-label">${t('Şarap bölgeleri')}</h3><div class="region-list">${p.regions.map((r) => `<span>${escapeHTML(r)}</span>`).join('')}</div></section><section class="profile-section"><h3 class="section-label">${t('Şarapları tanı')}</h3>${p.wines.map((w) => `<article class="wine-card"><strong>${escapeHTML(w.name)}</strong><p>${escapeHTML(w.note)}</p></article>`).join('')}</section><a class="source-link" href="${escapeHTML(p.source)}" target="_blank" rel="noreferrer">${t('Kaynak ve ayrıntılı okuma ↗')}</a>`;
    } else {
      body = `<div class="empty-profile">${t('Bu ülke veya bölge için henüz doğrulanmış bir şarap profili eklenmedi. Bu, burada şarap üretilmediği anlamına gelmez.')}</div><section class="profile-section"><h3 class="section-label">${t('Keşfe devam et')}</h3><p class="profile-summary">${t('Altın tonundaki ülkelerde üzüm çeşitlerini, bölgeleri ve şarap stillerini inceleyebilirsin.')}</p><button class="nearby" id="back-turkey">${t('Türkiye profilini aç')}</button></section>`;
    }
    $('#profile').innerHTML = top + body;
    $('#profile').classList.remove('profile-enter'); void $('#profile').offsetWidth; $('#profile').classList.add('profile-enter');
    $('.country-panel').scrollTop = 0;
    if ($('#back-turkey')) $('#back-turkey').onclick = () => select('TUR', true);
  }
  function select(id, focus = false) {
    const f = byId.get(id);
    if (!f) return false;
    selected = id;
    $('#region-card').hidden = true;
    renderProfile(f);
    updatePosition(f);
    root.querySelectorAll('[data-country]').forEach((b) => { b.classList.toggle('selected', b.dataset.country === id); b.setAttribute('aria-pressed', String(b.dataset.country === id)); });
    $('#search').value = '';
    closeSearch();
    if (focus) focusCountry(f);
    draw();
    return true;
  }
  function focusCountry(f) {
    const [lng, lat] = f.properties.point;
    targetRotation = [-lng, Math.max(-56, Math.min(56, -lat * 0.72)), 0];
    targetZoom = 1.55;
    resumeAt = performance.now() + 3500;
  }
  function resize() {
    const rect = $('#stage').getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.35 : 1.75);
    width = Math.max(320, Math.round(rect.width));
    height = Math.max(300, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const scale = Math.min(width, height) * 0.44 * zoomLevel;
    projection.translate([width * 0.5, height * 0.52]).scale(scale);
    draw();
  }
  function drawAtmosphere() {
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, '#020607');
    bg.addColorStop(0.48, '#07100f');
    bg.addColorStop(1, '#111208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 34; i += 1) {
      const x = (i * 131) % width;
      const y = (i * 71) % height;
      ctx.fillStyle = i % 4 ? '#d7e6ff' : '#f4d58a';
      ctx.beginPath();
      ctx.arc(x, y, i % 5 === 0 ? 1.1 : 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function draw() {
    if (!ctx || !projection) return;
    projection.rotate(rotation);
    projection.scale(Math.min(width, height) * 0.44 * zoomLevel);
    path = d3lib.geoPath(projection, ctx);
    drawAtmosphere();
    const cx = width * 0.5, cy = height * 0.52, r = projection.scale();
    const halo = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.34, r * 0.1, cx, cy, r * 1.18);
    halo.addColorStop(0, 'rgba(221,188,119,0.26)');
    halo.addColorStop(0.54, 'rgba(52,92,118,0.2)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2); ctx.fill();
    const ocean = ctx.createRadialGradient(cx - r * 0.45, cy - r * 0.42, r * 0.08, cx, cy, r);
    ocean.addColorStop(0, '#2b556a');
    ocean.addColorStop(0.48, '#0f2735');
    ocean.addColorStop(1, '#020609');
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = ocean; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.beginPath(); path(graticule); ctx.strokeStyle = 'rgba(174,205,216,0.12)'; ctx.lineWidth = 0.65; ctx.stroke();
    ctx.beginPath(); path(land);
    ctx.fillStyle = '#263a3c';
    ctx.fill();
    ctx.strokeStyle = 'rgba(184,201,196,0.18)';
    ctx.lineWidth = 0.42;
    ctx.stroke();
    drawWineDots();
    drawFeature(hovered, '#b79555', 'rgba(255,235,184,0.45)', 0.75);
    drawFeature(selected, '#d9b759', 'rgba(255,238,188,0.85)', 1.05);
    drawRegions();
    const shade = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    shade.addColorStop(0, 'rgba(255,236,181,0.18)');
    shade.addColorStop(0.45, 'rgba(255,255,255,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.58)');
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = shade; ctx.fill();
    ctx.restore();
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.strokeStyle = 'rgba(226,193,107,0.58)'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx - r * 0.26, cy - r * 0.18, r * 0.98, -1.0, 0.18); ctx.strokeStyle = 'rgba(167,209,232,0.38)'; ctx.lineWidth = 2.1; ctx.stroke();
  }
  function drawFeature(id, fill, stroke, lineWidth) {
    const f = byId.get(id);
    if (!f || (f.properties.point && !visible(f.properties.point))) return;
    ctx.beginPath(); path(f);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke();
  }
  function drawWineDots() {
    ctx.save();
    wineFeatures.forEach((f) => {
      if (!visible(f.properties.point)) return;
      const p = projection(f.properties.point);
      if (!p) return;
      const isSelected = f.properties.id === selected;
      ctx.beginPath();
      ctx.arc(p[0], p[1], isSelected ? 3.8 : 2.1, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#fff0b9' : 'rgba(218,184,95,0.82)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(4,10,11,0.9)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });
    ctx.restore();
  }
  function drawRegions() {
    const regions = regionalWineMap[selected] || [];
    ctx.font = `700 ${Math.max(10, Math.min(13, width / 62))}px "DM Sans", sans-serif`;
    regions.forEach((region) => {
      if (!visible(region[1])) return;
      const p = projection(region[1]);
      if (!p) return;
      const x = p[0], y = p[1];
      ctx.beginPath(); ctx.arc(x, y, 4.2, 0, Math.PI * 2); ctx.fillStyle = '#ebca68'; ctx.fill();
      ctx.lineWidth = 1.4; ctx.strokeStyle = '#fff0bd'; ctx.stroke();
      if (zoomLevel < 1.25 && width < 700) return;
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(5,9,10,0.88)'; ctx.strokeText(region[0], x + 8, y + 4);
      ctx.fillStyle = '#f5e8bf'; ctx.fillText(region[0], x + 8, y + 4);
    });
  }
  function animate(now) {
    const dt = Math.min(34, now - lastFrame);
    lastFrame = now;
    if (!stageVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    const minFrameGap = dragging ? 33 : 42;
    if (now - lastDraw < minFrameGap) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    lastDraw = now;
    if (targetRotation) {
      rotation[0] += (targetRotation[0] - rotation[0]) * 0.08;
      rotation[1] += (targetRotation[1] - rotation[1]) * 0.08;
      if (Math.abs(targetRotation[0] - rotation[0]) < 0.08 && Math.abs(targetRotation[1] - rotation[1]) < 0.08) targetRotation = null;
    } else if (!dragging && !reduced && now > resumeAt) {
      rotation[0] -= dt * 0.004;
    }
    if (targetZoom) {
      zoomLevel += (targetZoom - zoomLevel) * 0.08;
      if (Math.abs(targetZoom - zoomLevel) < 0.01) targetZoom = null;
    }
    draw();
    animationId = requestAnimationFrame(animate);
  }
  function closeSearch() { $('#results').hidden = true; $('#search').setAttribute('aria-expanded', 'false'); }
  function search() {
    const query = fold($('#search').value.trim());
    const list = countries.filter((f) => !query || fold(`${name(f)} ${f.properties.name} ${f.properties.iso}`).includes(query)).sort((a, b) => name(a).localeCompare(name(b), 'tr')).slice(0, 40);
    const results = $('#results');
    results.innerHTML = '';
    for (const f of list) {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span>${escapeHTML(name(f))}</span>${profiles[f.properties.id] ? '<small>Şarap profili</small>' : ''}`;
      b.onclick = () => select(f.properties.id, true);
      li.append(b);
      results.append(li);
    }
    if (!list.length) {
      const li = document.createElement('li');
      li.textContent = t('Eşleşen ülke bulunamadı.');
      li.style.padding = '14px';
      results.append(li);
    }
    results.hidden = false;
    $('#search').setAttribute('aria-expanded', 'true');
  }
  function setMode(next) {
    for (const [id, value] of [['explore', 'explore'], ['pan', 'pan']]) {
      const b = $(`#${id}`);
      b.classList.toggle('active', next === value);
      b.setAttribute('aria-pressed', String(next === value));
    }
    $('#gesture-hint').textContent = next === 'pan' ? t('Sürükle · Dünya döner') : t('Üzerinde gezin · Seçmek için dokun');
  }
  function applyLanguage() {
    if (!en) return;
    document.documentElement.lang = 'en';
    $('.eyebrow').textContent = 'VINEYARDS OF THE WORLD';
    $('.intro h1').innerHTML = 'World <em>Wine Atlas</em>';
    $('.intro-copy').innerHTML = 'Touch a country.<br>Discover its grapes and wines.';
    $('#search').placeholder = 'Search countries…';
    $('#search').setAttribute('aria-label', 'Search countries');
    $('#explore').textContent = 'Explore';
    $('#pan').textContent = 'Move';
    root.querySelector('.wine-key').parentElement.lastChild.textContent = ' Wine profile';
    root.querySelector('.legend span:nth-child(2)').lastChild.textContent = ' Other countries';
    const labels = { Türkiye: 'Turkey', Fransa: 'France', İtalya: 'Italy', ABD: 'United States', Gürcistan: 'Georgia', Arjantin: 'Argentina', Avustralya: 'Australia' };
    root.querySelectorAll('[data-country]').forEach((button) => { button.textContent = labels[button.textContent] || button.textContent; });
    $('#coverage').textContent = 'All countries · Selected wine profiles';
    const details = root.querySelector('.notes details');
    details.querySelector('summary').textContent = 'About this map and its content';
    const notes = details.querySelectorAll('p');
    notes[0].innerHTML = 'Country and regional boundaries: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a>. Dependent territories are included; boundaries do not express a legal view. Smaller countries can be selected from the search field.';
    notes[1].textContent = 'Wines, grape varieties and regions are a representative selection, not a catalogue of every producer or wine. A missing profile does not mean that wine is not produced there.';
    notes[2].textContent = 'Map: public domain. D3: ISC licence. Text is summarised for this atlas.';
  }

  async function init() {
    try {
      if (!d3lib) throw Error('Map library unavailable');
      applyLanguage();
      const get = async (url) => { const r = await fetch(url); if (!r.ok) throw Error(url); return r.json(); };
      const [world, data] = await Promise.all([get(`${atlasBase}world.json`), get(`${atlasBase}profiles.json`)]);
      countries = world.features;
      land = { type: 'FeatureCollection', features: countries };
      profiles = data;
      byId = new Map(countries.map((f) => [f.properties.id, f]));
      wineFeatures = countries.filter((f) => profiles[f.properties.id]);
      for (const f of countries) {
        const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
        for (const coordinates of polys) if (d3lib.geoArea({ type: 'Polygon', coordinates }) > 2 * Math.PI) coordinates.forEach((r) => r.reverse());
      }
      canvas = $('#globe');
      ctx = canvas.getContext('2d');
      projection = d3lib.geoOrthographic().precision(0.45).clipAngle(90);
      graticule = d3lib.geoGraticule10();
      new ResizeObserver(resize).observe($('#stage'));
      new IntersectionObserver((entries) => {
        stageVisible = entries[0]?.isIntersecting ?? true;
      }, { threshold: 0.05 }).observe($('#stage'));
      $('#load-state').hidden = true;
      select('TUR');
      $('#explore').onclick = () => setMode('explore');
      $('#pan').onclick = () => setMode('pan');
      $('#zoom-in').onclick = () => { targetZoom = Math.min(1.95, zoomLevel + 0.24); resumeAt = performance.now() + 1800; };
      $('#zoom-out').onclick = () => { targetZoom = Math.max(0.88, zoomLevel - 0.24); resumeAt = performance.now() + 1800; };
      $('#reset').onclick = () => { targetRotation = [-31, -26, 0]; targetZoom = 1.08; resumeAt = performance.now() + 1200; };
      root.querySelectorAll('[data-country]').forEach((b) => { b.onclick = () => select(b.dataset.country, true); });
      $('#search').addEventListener('input', search);
      $('#search').addEventListener('focus', search);
      $('#search').addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if (e.key === 'ArrowDown') { e.preventDefault(); $('#results button')?.focus(); }
        if (e.key === 'Enter') $('#results button')?.click();
      });
      $('#results').addEventListener('keydown', (e) => {
        const buttons = [...$('#results').querySelectorAll('button')], i = buttons.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); buttons[(i + 1) % buttons.length]?.focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); buttons[(i - 1 + buttons.length) % buttons.length]?.focus(); }
        if (e.key === 'Escape') { $('#search').focus(); closeSearch(); }
      });
      document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.search-wrap')) closeSearch(); });
      canvas.addEventListener('pointerdown', (e) => {
        dragging = true; moved = false; start = { x: e.clientX, y: e.clientY, r: [...rotation] }; targetRotation = null; resumeAt = performance.now() + 2500;
        canvas.setPointerCapture?.(e.pointerId);
      });
      canvas.addEventListener('pointermove', (e) => {
        if (dragging && start) {
          const dx = e.clientX - start.x, dy = e.clientY - start.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
          rotation[0] = start.r[0] + dx * 0.2;
          rotation[1] = Math.max(-62, Math.min(62, start.r[1] - dy * 0.16));
          $('#region-card').hidden = true;
          draw();
          return;
        }
        showHover(countryAt(e.clientX, e.clientY), e);
      });
      canvas.addEventListener('pointerup', (e) => {
        dragging = false;
        canvas.releasePointerCapture?.(e.pointerId);
        const f = countryAt(e.clientX, e.clientY);
        const region = regionAt(e.clientX, e.clientY);
        if (!moved && region) showRegion(region.data, region.point);
        else if (!moved && f) select(f.properties.id, true);
        resumeAt = performance.now() + 1600;
        start = null;
      });
      canvas.addEventListener('pointerleave', (e) => { if (!dragging) showHover(null, e); });
      canvas.addEventListener('wheel', (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        zoomLevel = Math.max(0.88, Math.min(1.95, zoomLevel + (e.deltaY < 0 ? 0.12 : -0.12)));
        resumeAt = performance.now() + 1500;
        draw();
      }, { passive: false });
      $('#coverage').textContent = en ? `${countries.length} countries & territories · ${Object.keys(profiles).length} wine profiles` : `${countries.length} ülke ve bölge · ${Object.keys(profiles).length} şarap profili`;
      if (!reduced) animationId = requestAnimationFrame(animate);
      if (document.modelContext?.registerTool) {
        try {
          document.modelContext.registerTool({
            name: 'explore_wine_country',
            description: 'Select a country on the wine atlas and show its grapes, wine styles and regions.',
            inputSchema: { type: 'object', properties: { country: { type: 'string', description: 'Country name or three-letter code, for example TUR or Türkiye' } }, required: ['country'], additionalProperties: false },
            execute: (input) => {
              if (typeof input?.country !== 'string') throw Error('country is required');
              const f = countries.find((item) => item.properties.id === input.country.toUpperCase() || fold(name(item)) === fold(input.country) || fold(item.properties.name) === fold(input.country));
              if (!f) throw Error('Country not found');
              select(f.properties.id, true);
              return { country: name(f), profile: profiles[f.properties.id] || null };
            }
          });
        } catch { /* Browser support is optional. */ }
      }
    } catch (error) {
      $('#load-state').innerHTML = en ? 'The map could not load.<br><button id="retry">Try again</button>' : 'Harita yüklenemedi.<br><button id="retry">Tekrar dene</button>';
      $('#retry').onclick = () => location.reload();
      console.error(error);
    }
  }
  function regionAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (width / rect.width);
    const y = (clientY - rect.top) * (height / rect.height);
    for (const data of regionalWineMap[selected] || []) {
      if (!visible(data[1])) continue;
      const p = projection(data[1]);
      if (p && Math.hypot(p[0] - x, p[1] - y) < 18) return { data, point: [x, y] };
    }
    return null;
  }
  init();
  return () => cancelAnimationFrame(animationId);
}