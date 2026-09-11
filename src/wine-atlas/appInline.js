export function mountWineAtlas(root){
const $=s=>root.querySelector(s);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const continents={'Asia':'Asya','Europe':'Avrupa','Africa':'Afrika','North America':'Kuzey Amerika','South America':'Güney Amerika','Oceania':'Okyanusya','Antarctica':'Antarktika','Seven seas (open ocean)':'Okyanus adaları'};
let countries=[],profiles={},byId=new Map(),selected='TUR',hovered=null,mode='explore',transform,projection,path,zoom,svg,paths,micros;
const pointers=new Set();let multi=false,lastTouch=null;
const atlasBase=`${import.meta.env.BASE_URL}wine-atlas/`;
const lang=root.dataset.lang==='en'?'en':'tr';
const en=lang==='en';
const copy=en?{
  'Öne çıkan üzümler':'Signature grapes','Şarap bölgeleri':'Wine regions','Şarapları tanı':'Discover the wines',
  'Üzümler & şaraplar':'Grapes & wines','Ülke bilgisi':'Country information',
  'Sürükle · İki parmakla yakınlaştır':'Drag · Pinch to zoom','Üzerinde gezin · Seçmek için dokun':'Hover · Tap to select',
  'Eşleşen ülke bulunamadı.':'No matching country found.','Türkiye profilini aç':'Open the Turkey profile',
  'Bu ülke veya bölge için henüz doğrulanmış bir şarap profili eklenmedi. Bu, burada şarap üretilmediği anlamına gelmez.':'A verified wine profile has not yet been added for this country or region. This does not mean wine is not produced here.',
  'Keşfe devam et':'Continue exploring','Altın tonundaki ülkelerde üzüm çeşitlerini, bölgeleri ve şarap stillerini inceleyebilirsin.':'Explore grape varieties, regions and wine styles in the countries highlighted in gold.',
  'Kaynak ve ayrıntılı okuma ↗':'Source & further reading ↗'
}:{};
const t=value=>copy[value]||value;
const countryNames=en?{Türkiye:'Turkey',ABD:'United States',Gürcistan:'Georgia'}:{};
const regionalWineMap={
 FRA:[['Bordeaux',[-0.58,44.84],['Bordeaux blends','Cabernet Sauvignon & Merlot']],['Bourgogne',[4.84,47.05],['Pinot Noir','Chardonnay']],['Champagne',[4.03,49.26],['Champagne','Traditional-method sparkling wine']],['Loire',[0.1,47.3],['Sauvignon Blanc','Chenin Blanc']],['Rhône',[4.8,44.2],['Syrah','Grenache blends']],['Alsace',[7.35,48.1],['Riesling','Gewürztraminer']]],
 ITA:[['Piemonte',[8.05,44.7],['Barolo','Barbaresco']],['Toscana',[11.2,43.5],['Chianti Classico','Brunello di Montalcino']],['Veneto',[11.9,45.5],['Prosecco','Amarone']],['Sicilia',[14.0,37.5],['Nero d’Avola','Etna wines']]],
 TUR:[['Trakya',[27.0,41.0],['Cabernet blends','Papazkarası']],['Ege',[27.0,38.2],['Bornova Misketi','Syrah']],['Kapadokya',[34.7,38.6],['Emir','Narince']],['Elazığ',[39.2,38.7],['Öküzgözü','Boğazkere']]],
 USA:[['Napa Valley',[-122.3,38.5],['Cabernet Sauvignon','Chardonnay']],['Sonoma',[-122.9,38.4],['Pinot Noir','Zinfandel']],['Willamette Valley',[-123.1,45.3],['Pinot Noir','Chardonnay']],['Finger Lakes',[-76.8,42.7],['Riesling','Cabernet Franc']]],
 ESP:[['Rioja',[-2.5,42.5],['Tempranillo','Reserva reds']],['Ribera del Duero',[-3.7,41.6],['Tempranillo','Crianza reds']],['Rías Baixas',[-8.6,42.4],['Albariño','Atlantic whites']],['Jerez',[-6.1,36.7],['Fino','Oloroso Sherry']]],
 PRT:[['Douro',[-7.8,41.2],['Port','Douro reds']],['Vinho Verde',[-8.4,41.7],['Vinho Verde','Alvarinho']],['Dão',[-7.9,40.5],['Touriga Nacional','Encruzado']]],
 ARG:[['Mendoza',[-69.1,-32.9],['Malbec','Cabernet Sauvignon']],['Uco Valley',[-69.3,-33.7],['High-altitude Malbec','Chardonnay']],['Salta',[-65.4,-24.8],['Torrontés','Malbec']]],
 CHL:[['Maipo',[-70.7,-33.6],['Cabernet Sauvignon','Carménère']],['Colchagua',[-71.1,-34.6],['Carménère','Syrah']],['Casablanca',[-71.4,-33.3],['Sauvignon Blanc','Chardonnay']]],
 AUS:[['Barossa Valley',[139.0,-34.5],['Shiraz','Grenache']],['Margaret River',[115.1,-33.9],['Cabernet Sauvignon','Chardonnay']],['Hunter Valley',[151.3,-32.8],['Semillon','Shiraz']]],
 NZL:[['Marlborough',[173.8,-41.5],['Sauvignon Blanc','Pinot Noir']],['Central Otago',[169.2,-45.0],['Pinot Noir','Riesling']],['Hawke’s Bay',[176.8,-39.6],['Syrah','Bordeaux blends']]],
 DEU:[['Mosel',[6.9,49.9],['Riesling','Spätlese']],['Rheingau',[8.1,50.0],['Riesling','Spätburgunder']],['Pfalz',[8.1,49.3],['Riesling','Pinot Noir']]],
 ZAF:[['Stellenbosch',[18.86,-33.94],['Cabernet Sauvignon','Chenin Blanc']],['Swartland',[18.77,-33.4],['Syrah','Chenin Blanc']],['Constantia',[18.45,-34.03],['Vin de Constance','Sauvignon Blanc']]]
};

function name(f){const value=f.properties.id==='TUR'?'Türkiye':f.properties.tr||f.properties.name;return countryNames[value]||value;}
function fold(s){return s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');}
function updateClasses(){paths.classed('selected',d=>d.properties.id===selected).classed('hovered',d=>d.properties.id===hovered);micros.classed('selected',d=>d.properties.id===selected).classed('hovered',d=>d.properties.id===hovered);}
function positionRegions(){
 const k=transform?.k||1;d3.select('#wine-regions').selectAll('.wine-region').attr('transform',d=>{const p=projection(d[1]);return `translate(${p[0]},${p[1]}) scale(${1/k})`;});
}
function renderRegions(){
 const data=regionalWineMap[selected]||[];const group=d3.select('#wine-regions');group.selectAll('*').remove();
 if(!data.length)return;
 group.selectAll('g').data(data).join('g').attr('class','wine-region').on('click',(event,d)=>{event.stopPropagation();showRegion(d,event);}).each(function(d){const g=d3.select(this);g.append('circle').attr('r',3.8);g.append('circle').attr('r',1.35);g.append('text').attr('x',6).attr('y',3).text(d[0]);});positionRegions();
}
function showRegion(region,event){
 const card=$('#region-card');card.innerHTML=`<strong>${escapeHTML(region[0])}</strong><span>${region[2].map(escapeHTML).join(' · ')}</span>`;card.hidden=false;const stage=$('#stage').getBoundingClientRect(),w=card.offsetWidth;card.style.left=Math.max(8,Math.min(stage.width-w-8,event.clientX-stage.left+12))+'px';card.style.top=Math.max(8,Math.min(stage.height-64,event.clientY-stage.top-58))+'px';
}
function mark(){
 const f=byId.get(selected),p=projection(f.properties.point);if(!p)return;
 const g=d3.select('#marker');g.selectAll('*').remove();g.attr('transform',`translate(${p[0]},${p[1]}) scale(${1/transform.k})`);
 g.append('circle').attr('r',9).attr('class','selection-ring');g.append('circle').attr('r',3.5).attr('class','selection-dot');
}
function renderProfile(f){
 const p=profiles[f.properties.id],code=f.properties.iso;
 const top=`<div class="profile-top"><span>${escapeHTML(en?f.properties.continent:(continents[f.properties.continent]||f.properties.continent))}</span><span class="country-code">${escapeHTML(code==='-99'?f.properties.id:code)}</span></div><h2>${escapeHTML(name(f))}</h2>`;
 let body;
 if(p){body=`<p class="profile-summary">${escapeHTML(p.summary)}</p><section class="profile-section"><h3 class="section-label">${t('Öne çıkan üzümler')}</h3><div class="grapes">${p.grapes.map(g=>`<span class="grape ${g.color==='r'?'red':''}"><i aria-hidden="true"></i>${escapeHTML(g.name)}</span>`).join('')}</div></section><section class="profile-section"><h3 class="section-label">${t('Şarap bölgeleri')}</h3><div class="region-list">${p.regions.map(r=>`<span>${escapeHTML(r)}</span>`).join('')}</div></section><section class="profile-section"><h3 class="section-label">${t('Şarapları tanı')}</h3>${p.wines.map(w=>`<article class="wine-card"><strong>${escapeHTML(w.name)}</strong><p>${escapeHTML(w.note)}</p></article>`).join('')}</section><a class="source-link" href="${escapeHTML(p.source)}" target="_blank" rel="noreferrer">${t('Kaynak ve ayrıntılı okuma ↗')}</a>`;
 }else{body=`<div class="empty-profile">${t('Bu ülke veya bölge için henüz doğrulanmış bir şarap profili eklenmedi. Bu, burada şarap üretilmediği anlamına gelmez.')}</div><section class="profile-section"><h3 class="section-label">${t('Keşfe devam et')}</h3><p class="profile-summary">${t('Altın tonundaki ülkelerde üzüm çeşitlerini, bölgeleri ve şarap stillerini inceleyebilirsin.')}</p><button class="nearby" id="back-turkey">${t('Türkiye profilini aç')}</button></section>`;}
 $('#profile').innerHTML=top+body;
 $('#profile').classList.remove('profile-enter');void $('#profile').offsetWidth;$('#profile').classList.add('profile-enter');
 $('.country-panel').scrollTop=0;
 if($('#back-turkey'))$('#back-turkey').onclick=()=>select('TUR',true);
}
function select(id,focus=false){
 const f=byId.get(id);if(!f)return false;
 selected=id;renderProfile(f);updateClasses();mark();if(focus)renderRegions();else d3.select('#wine-regions').selectAll('*').remove();
 const [lng,lat]=f.properties.point;$('#position').textContent=`${Math.abs(lat).toFixed(2)}° ${lat>=0?'N':'S'} / ${Math.abs(lng).toFixed(2)}° ${lng>=0?'E':'W'}`;
 root.querySelectorAll('[data-country]').forEach(b=>{b.classList.toggle('selected',b.dataset.country===id);b.setAttribute('aria-pressed',String(b.dataset.country===id));});
 $('#search').value='';closeSearch();if(focus)focusCountry(f);return true;
}
function focusCountry(f){
 const [[x0,y0],[x1,y1]]=path.bounds(f),pt=projection(f.properties.point);
 const k=Math.max(1.5,Math.min(8, .64/Math.max((x1-x0)/1000,(y1-y0)/550)));
 const x=pt[0],y=pt[1];svg.transition().duration(reduced?0:650).call(zoom.transform,d3.zoomIdentity.translate(500-k*x,275-k*y).scale(k));
}
function showHover(f,event){
 const id=f?.properties.id||null;if(hovered!==id){hovered=id;updateClasses();}
 const box=$('#hover');if(!f){box.hidden=true;return;}
 box.innerHTML=`${escapeHTML(name(f))}<small>${profiles[id]?t('Üzümler & şaraplar'):t('Ülke bilgisi')}</small>`;box.hidden=false;
 const stage=$('#stage').getBoundingClientRect(),w=box.offsetWidth;
 box.style.left=Math.max(7,Math.min(stage.width-w-7,event.clientX-stage.left+12))+'px';
 box.style.top=Math.max(5,Math.min(stage.height-65,event.clientY-stage.top-(event.pointerType==='touch'?82:60)))+'px';
}
function featureAt(e){const el=document.elementFromPoint(e.clientX,e.clientY);return el?.dataset?.countryId?byId.get(el.dataset.countryId):null;}
function closeSearch(){$('#results').hidden=true;$('#search').setAttribute('aria-expanded','false');}
function search(){
 const query=fold($('#search').value.trim());const list=countries.filter(f=>!query||fold(name(f)+' '+f.properties.name+' '+f.properties.iso).includes(query)).sort((a,b)=>name(a).localeCompare(name(b),'tr')).slice(0,40);
 const root=$('#results');root.innerHTML='';
 for(const f of list){const li=document.createElement('li');li.setAttribute('role','option');const b=document.createElement('button');b.type='button';b.innerHTML=`<span>${escapeHTML(name(f))}</span>${profiles[f.properties.id]?'<small>Şarap profili</small>':''}`;b.onclick=()=>select(f.properties.id,true);li.append(b);root.append(li);}
 if(!list.length){const li=document.createElement('li');li.textContent=t('Eşleşen ülke bulunamadı.');li.style.padding='14px';root.append(li);}
 root.hidden=false;$('#search').setAttribute('aria-expanded','true');
}
function setMode(next){mode=next;for(const [id,value]of [['explore','explore'],['pan','pan']]){const b=$('#'+id);b.classList.toggle('active',mode===value);b.setAttribute('aria-pressed',String(mode===value));}$('#map').style.cursor=mode==='pan'?'grab':'';$('#gesture-hint').textContent=mode==='pan'?t('Sürükle · İki parmakla yakınlaştır'):t('Üzerinde gezin · Seçmek için dokun');}
function applyLanguage(){
 if(!en)return;
 document.documentElement.lang='en';
 document.title='World Wine Atlas · İbrahim Kavüşt';
 $('.eyebrow').textContent='VINEYARDS OF THE WORLD';
 $('.intro h1').innerHTML='World <em>Wine Atlas</em>';
 $('.intro-copy').innerHTML='Touch a country.<br>Discover its grapes and wines.';
 $('.map-side').setAttribute('aria-label','Interactive world map');
 $('#search').placeholder='Search countries…'; $('#search').setAttribute('aria-label','Search countries');
 $('#explore').textContent='Explore'; $('#pan').textContent='Move';
 $('#map').setAttribute('aria-label','Countries of the world. You can also select countries using the search field.');
 $('#zoom-in').setAttribute('aria-label','Zoom in');$('#zoom-out').setAttribute('aria-label','Zoom out');$('#reset').setAttribute('aria-label','Return to world view');
 root.querySelector('.wine-key').parentElement.lastChild.textContent=' Wine profile';
 root.querySelector('.legend span:nth-child(2)').lastChild.textContent=' Other countries';
 $('#gesture-hint').textContent=t('Üzerinde gezin · Seçmek için dokun');
 const labels={Türkiye:'Turkey',Fransa:'France',İtalya:'Italy',ABD:'United States',Gürcistan:'Georgia',Arjantin:'Argentina',Avustralya:'Australia'};
 root.querySelectorAll('[data-country]').forEach(button=>{button.textContent=labels[button.textContent]||button.textContent;});
 $('#coverage').textContent='All countries · Selected wine profiles';
 const details=root.querySelector('.notes details');
 details.querySelector('summary').textContent='About this map and its content';
 const notes=details.querySelectorAll('p');
 notes[0].innerHTML='Country and regional boundaries: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a>. Dependent territories are included; boundaries do not express a legal view. Smaller countries can be selected from the search field.';
 notes[1].textContent='Wines, grape varieties and regions are a representative selection, not a catalogue of every producer or wine. A missing profile does not mean that wine is not produced there.';
 notes[2].textContent='Map: public domain. D3: ISC licence. Text is summarised for this atlas.';
}
applyLanguage();

async function init(){
 try{
  if(typeof d3==='undefined')throw Error('Map library unavailable');
  const get=async url=>{const r=await fetch(url);if(!r.ok)throw Error(url);return r.json();};
  const [world,data]=await Promise.all([get(atlasBase+'world.json'),get(atlasBase+'profiles.json')]);
  countries=world.features;profiles=data;byId=new Map(countries.map(f=>[f.properties.id,f]));
  // D3 spherical paths expect clockwise exterior rings.
  for(const f of countries){const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;for(const coordinates of polys){if(d3.geoArea({type:'Polygon',coordinates})>2*Math.PI)coordinates.forEach(r=>r.reverse());}}
  projection=d3.geoEqualEarth().fitExtent([[18,16],[982,534]],{type:'Sphere'});path=d3.geoPath(projection);svg=d3.select('#map');transform=d3.zoomIdentity;
  d3.select('#grid').append('path').datum(d3.geoGraticule10()).attr('d',path);
  paths=d3.select('#countries').selectAll('path').data(countries).join('path').attr('d',path).attr('class',d=>'country'+(profiles[d.properties.id]?' wine':'')).attr('data-country-id',d=>d.properties.id).attr('aria-label',d=>name(d));
  paths.append('title').text(d=>name(d));
  const tiny=countries.filter(f=>path.area(f)<4&&f.properties.id!=='ATA');
  micros=d3.select('#microstates').selectAll('circle').data(tiny).join('circle').attr('class',d=>'micro'+(profiles[d.properties.id]?' wine':'')).attr('data-country-id',d=>d.properties.id).attr('cx',d=>projection(d.properties.point)[0]).attr('cy',d=>projection(d.properties.point)[1]).attr('r',2.2);
  zoom=d3.zoom().extent([[0,0],[1000,550]]).scaleExtent([1,12]).translateExtent([[-350,-150],[1350,700]]).filter(e=>{
   if(e.type==='wheel')return e.ctrlKey||e.metaKey;
   if(e.type==='dblclick')return false;
   if(e.type.startsWith('touch'))return mode==='pan'||e.touches.length>1;
   return mode==='pan'&&!e.button;
  }).on('zoom',e=>{transform=e.transform;d3.select('#geography').attr('transform',transform);micros.attr('r',2.2/Math.sqrt(transform.k));mark();positionRegions();$('#hover').hidden=true;$('#region-card').hidden=true;});
  svg.call(zoom).on('dblclick.zoom',null);
  const map=$('#map');
  map.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;pointers.add(e.pointerId);if(pointers.size>1)multi=true;if(mode==='explore'&&!multi){lastTouch=featureAt(e);showHover(lastTouch,e);}if(e.target.hasPointerCapture?.(e.pointerId))e.target.releasePointerCapture(e.pointerId);});
  map.addEventListener('pointermove',e=>{if(mode==='pan'||multi)return;if(e.pointerType==='mouse'||pointers.has(e.pointerId)){const f=featureAt(e);showHover(f,e);if(e.pointerType!=='mouse')lastTouch=f;}});
  window.addEventListener('pointerup',e=>{if(!pointers.has(e.pointerId))return;if(!multi&&mode==='explore'&&lastTouch)select(lastTouch.properties.id,true);pointers.delete(e.pointerId);if(!pointers.size){multi=false;lastTouch=null;showHover(null,e);}});
  window.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);if(!pointers.size){multi=false;lastTouch=null;}showHover(null,e);});
  map.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')showHover(null,e);});
  map.addEventListener('click',e=>{if(e.pointerType&&e.pointerType!=='mouse')return;if(mode==='pan'||e.defaultPrevented)return;const f=featureAt(e);if(f)select(f.properties.id,true);});
  $('#explore').onclick=()=>setMode('explore');$('#pan').onclick=()=>setMode('pan');
  $('#zoom-in').onclick=()=>svg.transition().duration(reduced?0:300).call(zoom.scaleBy,1.7);
  $('#zoom-out').onclick=()=>svg.transition().duration(reduced?0:300).call(zoom.scaleBy,1/1.7);
  const reset=()=>svg.transition().duration(reduced?0:650).call(zoom.transform,d3.zoomIdentity);
  $('#reset').onclick=reset;
  const brand=$('.brand');
  if(brand)brand.onclick=e=>{e.preventDefault();reset();};
  root.querySelectorAll('[data-country]').forEach(b=>b.onclick=()=>select(b.dataset.country,true));
  $('#search').addEventListener('input',search);$('#search').addEventListener('focus',search);
  $('#search').addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();if(e.key==='ArrowDown'){e.preventDefault();$('#results button')?.focus();}if(e.key==='Enter')$('#results button')?.click();});
  $('#results').addEventListener('keydown',e=>{const buttons=[...$('#results').querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();buttons[(i+1)%buttons.length]?.focus();}if(e.key==='ArrowUp'){e.preventDefault();buttons[(i-1+buttons.length)%buttons.length]?.focus();}if(e.key==='Escape'){$('#search').focus();closeSearch();}});
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-wrap'))closeSearch();});
  $('#coverage').textContent=en?`${countries.length} countries & territories · ${Object.keys(profiles).length} wine profiles`:`${countries.length} ülke ve bölge · ${Object.keys(profiles).length} şarap profili`;
  $('#load-state').hidden=true;select('TUR');
  if(document.modelContext?.registerTool){try{document.modelContext.registerTool({name:'explore_wine_country',description:'Select a country on the wine atlas and show its grapes, wine styles and regions.',inputSchema:{type:'object',properties:{country:{type:'string',description:'Country name or three-letter code, for example TUR or Türkiye'}},required:['country'],additionalProperties:false},execute:input=>{if(typeof input?.country!=='string')throw Error('country is required');const f=countries.find(f=>f.properties.id===input.country.toUpperCase()||fold(name(f))===fold(input.country)||fold(f.properties.name)===fold(input.country));if(!f)throw Error('Country not found');select(f.properties.id,true);return {country:name(f),profile:profiles[f.properties.id]||null};}});}catch{/* Browser support is optional. */}}
 }catch(error){$('#load-state').innerHTML=en?'The map could not load.<br><button id="retry">Try again</button>':'Harita yüklenemedi.<br><button id="retry">Tekrar dene</button>';$('#retry').onclick=()=>location.reload();console.error(error);}
}
init();
}
