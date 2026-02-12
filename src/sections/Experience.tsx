import { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    title: 'Service Manager',
    company: 'The Barrel Bistro and Wine Bar',
    location: 'San Mateo, CA - USA',
    period: 'Nisan 2023 - Günümüz',
    description: 'Restoran operasyonlarının yönetimi, ekip koordinasyonu ve misafir deneyiminin optimize edilmesi.',
    current: true,
  },
  {
    title: 'Supervisor',
    company: 'Dubai Le Meridien Mina Seyahi Beach Resort & Waterpark',
    location: 'Dubai, Birleşik Arap Emirlikleri',
    period: 'Kasım 2021 - Nisan 2023',
    description: 'Marriott International bünyesinde lüks resort otelin F&B operasyonlarının yönetimi.',
    current: false,
  },
  {
    title: 'Supervisor',
    company: 'EXPO 2020 - Marriott International',
    location: 'Dubai, Birleşik Arap Emirlikleri',
    period: 'Kasım 2021 - Mart 2022',
    description: 'Dünya Expo\'sunda uluslararası misafirler için premium hizmet standartlarının uygulanması.',
    current: false,
  },
  {
    title: 'Restaurant Manager',
    company: 'Esen Tourism Management and Trade',
    location: 'Kuşadası, Aydın - Türkiye',
    period: 'Temmuz 2021 - Ekim 2021',
    description: 'Sezonluk restoran operasyonlarının tam yönetimi ve ekip liderliği.',
    current: false,
  },
  {
    title: 'Restaurant Captain / Head Waiter',
    company: 'Cestur Cesme Reconstruction Tourism',
    location: 'Çeşme, İzmir - Türkiye',
    period: 'Ağustos 2019 - Temmuz 2021',
    description: 'Fine dining restoranda masa servisi ekibinin liderliği ve misafir ilişkileri yönetimi.',
    current: false,
  },
  {
    title: 'Tourism and Hospitality Staff',
    company: 'Inter Turquoise Travel',
    location: 'Menderes, İzmir - Türkiye',
    period: 'Temmuz 2017 - Eylül 2017',
    description: 'Turizm sektöründe ilk deneyim ve misafir hizmetleri temelleri.',
    current: false,
  },
];

export default function Experience() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      className="relative w-full py-32 overflow-hidden bg-black-matte"
      ref={sectionRef}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase mb-6">Kariyer</span>
          <h2 className="text-5xl sm:text-6xl font-serif text-white mb-6">
            İş <span className="text-gradient-gold italic">Deneyimim</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/50" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="w-12 h-px bg-gold/50" />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent hidden lg:block" />

          {/* Experience items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 lg:left-1/2 top-0 w-3 h-3 bg-gold rounded-full -translate-x-1/2 hidden lg:block shadow-gold" />

                {/* Left side (odd items) / Right side (even items) */}
                <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:col-start-2 lg:pl-16'}`}>
                  <div className="group p-8 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:shadow-gold bg-black-card/30">
                    {/* Current badge */}
                    {exp.current && (
                      <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs tracking-wider uppercase mb-4">
                        Mevcut
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-gold transition-colors">
                      {exp.title}
                    </h3>

                    {/* Company */}
                    <div className="flex items-center gap-2 mb-4 lg:justify-start">
                      <Briefcase className="w-4 h-4 text-gold/60" />
                      <span className="text-gold-light font-medium">{exp.company}</span>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                {index % 2 === 0 ? <div className="hidden lg:block" /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
