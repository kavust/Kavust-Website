const revision = 'dna-silk-20261029';

export function mountSensory(root, en) {
  const host = document.createElement('div');
  host.style.cssText = 'display:block;width:100%;margin-top:16px;';
  const shadow = host.attachShadow({ mode: 'open' });
  root.querySelector('.country-panel').append(host);
  let state = { en, name: '', grapes: [] };
  let content;
  const send = () => content?.dispatchEvent(new CustomEvent('wine-sensory', { detail: state }));

  // Preserve the design without an iframe or a separate scrollable document.
  Promise.all([
    fetch(`${import.meta.env.BASE_URL}silk-atlas.html?v=${revision}`).then(response => {
      if (!response.ok) throw new Error('Silk template unavailable');
      return response.text();
    }),
    import(/* @vite-ignore */ `${import.meta.env.BASE_URL}silk-runtime.js?v=${revision}`),
  ]).then(([html, { initSilk }]) => {
    if (!host.isConnected) return;
    const template = new DOMParser().parseFromString(html, 'text/html');
    template.querySelectorAll('style').forEach(style => shadow.append(style.cloneNode(true)));
    content = template.getElementById('kavust-silk-preview');
    shadow.append(content);
    initSilk(content).catch(() => {
      content.querySelector('.orb-error').hidden = false;
    });
    send();
  }).catch(() => {
    const retry = document.createElement('button');
    retry.textContent = en ? 'Reload animation' : 'Animasyonu yeniden yükle';
    retry.onclick = () => location.reload();
    shadow.append(retry);
  });

  return (name, grapes = []) => { state = { en, name, grapes }; send(); };
}
