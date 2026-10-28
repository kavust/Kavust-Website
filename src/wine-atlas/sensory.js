export function mountSensory(root, en) {
  const frame = document.createElement('iframe');
  frame.src = `${import.meta.env.BASE_URL}silk-atlas.html`;
  frame.title = en ? 'Interactive wine layers' : 'Şarabın interaktif katmanları';
  frame.style.cssText = 'display:block;width:100%;height:390px;border:0;margin-top:16px;';
  frame.loading = 'lazy';
  root.querySelector('.country-panel').append(frame);
  let state = { type: 'wine-sensory', en, name: '', grapes: [] };
  const send = () => frame.contentWindow?.postMessage(state, location.origin);
  frame.addEventListener('load', send);
  return (name, grapes = []) => { state = { type: 'wine-sensory', en, name, grapes }; send(); };
}
