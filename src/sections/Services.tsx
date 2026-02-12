import { useEffect, useRef, useState } from 'react';
import { Wine, UtensilsCrossed, Sparkles } from 'lucide-react';

const services = [
  {
    number: '01',
    icon: Wine,
    title: 'Şarap Eşleştirme',
    description: 'Menünüze özel kurated şarap seçkileri ve gastronomik uyum danışmanlığı. Her şişede bir hikaye, her yudumda bir deneyim.',
  },
  {
    number: '02',
    icon: UtensilsCrossed,
    title: 'Fine Dining Servis',
    description: 'Lüks restoran standartlarında, kusursuz masa servisi ve misafir deneyimi. Detaylarda gizli mükemmellik.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Eğitim & Danışmanlık',
    description: 'Profesyonel ekip eğitimleri ve restoran operasyon optimizasyonu. Bilgi ve tecrübenin aktarımı.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      className="relative w-full py-32 overflow-hidden bg-black-matte"
      ref={sectionRef}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gold/50 to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase mb-6">Uzmanlık</span>
          <h2 className="text-5xl sm:text-6xl font-serif text-white mb-6">
            Hizmet Verdiğim <span className="text-gradient-gold italic">Alanlar</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/50" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="w-12 h-px bg-gold/50" />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative p-10 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:shadow-gold bg-black-card/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Number */}
              <span className="absolute top-6 right-6 text-gold/20 text-5xl font-serif">
                {service.number}
              </span>

              {/* Icon */}
              <div className="mb-8">
                <div className="inline-flex p-4 border border-gold/30 group-hover:border-gold/60 group-hover:bg-gold/5 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-gold" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-gold transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-sm">
                {service.description}
              </p>

              {/* Bottom line accent */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
