import { useEffect, useRef } from 'react';

function WineSelection() {
  const imageFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateReveal = () => {
      const frame = imageFrameRef.current;
      if (!frame) return;

      const { top, bottom } = frame.getBoundingClientRect();
      const viewport = window.innerHeight;
      const entering = Math.min(1, Math.max(0, (viewport - top) / (viewport * 0.5)));
      const leaving = Math.min(1, Math.max(0, bottom / (viewport * 0.5)));
      const visibility = Math.min(entering, leaving);

      frame.style.opacity = String(visibility);
      frame.style.transform = `translateY(${(1 - visibility) * 36}px) scale(${0.98 + visibility * 0.02})`;
    };

    updateReveal();
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);

    return () => {
      window.removeEventListener('scroll', updateReveal);
      window.removeEventListener('resize', updateReveal);
    };
  }, []);

  return (
    <section className="bg-black-deep px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div
        ref={imageFrameRef}
        className="mx-auto max-w-5xl border border-gold/40 bg-black-deep p-2 transition-[opacity,transform] duration-700 ease-out sm:p-3"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/wine-selection.jpg`}
          alt="Wine and cheese selection"
          className="mx-auto max-h-[44rem] w-auto max-w-full object-contain"
        />
      </div>
    </section>
  );
}

export default WineSelection;
