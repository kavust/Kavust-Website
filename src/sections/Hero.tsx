import { useEffect, useRef } from 'react';
import { ArrowRight, Wine } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && imageRef.current) {
        const scrollY = window.scrollY;
        const opacity = Math.max(0, 1 - scrollY / 600);
        heroRef.current.style.opacity = String(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-black-deep"
      ref={heroRef}
    >
      {/* Background image - more visible */}
      <div 
        ref={imageRef}
        className="absolute right-0 top-0 w-full lg:w-2/3 h-full"
      >
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black-deep via-black-deep/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black-deep/50 via-transparent to-black-deep/30 z-10" />
        <img
          src="https://i.postimg.cc/VkgkLxQT/IMG-7170.jpg"
          alt="İbrahim Kavüşt"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 lg:px-16 py-32">
        <div className="max-w-2xl">
          {/* Logo - bigger */}
          <div className="mb-12 animate-fade-in">
            <img 
              src="https://i.postimg.cc/SKrXzX0j/IMG-2091.png" 
              alt="Logo" 
              className="h-20 w-auto opacity-90"
            />
          </div>

          {/* Subtitle with line */}
          <div className="flex items-center gap-6 mb-8 animate-fade-in">
            <div className="w-16 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">
              Uluslararası Sommelier
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-light text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Hizmetin
            <span className="block text-gradient-gold italic mt-2">Sanatsal Yönü</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Amerika, Dubai ve Türkiye'nin en seçkin restoranlarında edindiğim 
            10+ yıllık deneyimle, unutulmaz bir gastronomi yolculuğu sunuyorum.
          </p>

          {/* Wine Quote */}
          <div className="flex items-start gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Wine className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
            <div>
              <p className="text-gold-light italic text-xl font-serif leading-relaxed">
                "Şarap bir içki değil,<br />bir hikaye anlatır."
              </p>
              <p className="text-gray-500 text-sm mt-2">— İbrahim Kavüşt</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-4 px-10 py-4 border border-gold/50 text-gold text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-black-deep transition-all duration-500"
            >
              <span>İletişime Geç</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-12 left-8 z-20 flex items-center gap-4 text-gray-500 hover:text-gold transition-colors cursor-pointer group"
      >
        <span className="text-xs tracking-[0.2em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Keşfet
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
      </button>
    </section>
  );
}
