import { useEffect, useRef, useState } from 'react';

export default function WineAtlas() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [load, setLoad] = useState(false);
  const [height, setHeight] = useState(1000);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: '800px' });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== 'kavust-atlas-height') return;
      const value = event.data.height;
      if (typeof value === 'number' && Number.isFinite(value) && value > 200 && value < 6000) {
        setHeight(Math.ceil(value) + 2);
      }
    };
    window.addEventListener('message', resize);
    return () => window.removeEventListener('message', resize);
  }, []);

  return (
    <section ref={section} id="wine-atlas" aria-label="Dünya Şarap Atlası" className="relative w-full bg-black-deep scroll-mt-28">
      {load ? <iframe
        ref={frame}
        src={`${import.meta.env.BASE_URL}wine-atlas/index.html`}
        title="Dünya Şarap Atlası — ülkeler, üzümler ve şarap bölgeleri"
        style={{ width: '100%', height, display: 'block', border: 0 }}
      /> : <div style={{ minHeight: 600 }} aria-hidden="true" />}
    </section>
  );
}
