export function mountSensory(root, en) {
  const frame = document.createElement('iframe');
  frame.src = `${import.meta.env.BASE_URL}silk-atlas.html?v=scroll-routing-20261028`;
  frame.title = en ? 'Interactive wine layers' : 'Şarabın interaktif katmanları';
  frame.style.cssText = 'display:block;width:100%;height:440px;border:0;margin-top:16px;';
  frame.scrolling = 'no';
  frame.loading = 'lazy';
  let state = { type: 'wine-sensory', en, name: '', grapes: [] };
  const send = () => frame.contentWindow?.postMessage(state, location.origin);
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== 'sensory-height') return;
    const height = Number(event.data.height);
    if (Number.isFinite(height) && height > 0 && Math.abs(frame.offsetHeight - height) > 1) frame.style.height = `${Math.ceil(height)}px`;
  });
  frame.addEventListener('load', send);
  root.querySelector('.country-panel').append(frame);
  return (name, grapes = []) => { state = { type: 'wine-sensory', en, name, grapes }; send(); };
}
