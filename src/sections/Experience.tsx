import { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    company: 'The Barrel Bistro and Wine Bar',
    location: 'San Mateo, CA - USA',
    period: 'Nisan 2023 - Günümüz',
  },
  {
    company: 'Dubai Le Meridien Mina Seyahi Beach Resort & Waterpark',
    location: 'Dubai, Birleşik Arap Emirlikleri',
    period: 'Kasım 2021 - Nisan 2023',
  },
  {
    company: 'EXPO 2020 - Marriott International',
    location: 'Dubai, Birleşik Arap Emirlikleri',
    period: 'Kasım 2021 - Mart 2022',
  },
  {
    company: 'Esen Tourism Management and Trade',
    location: 'Kuşadası, Aydın - Türkiye',
    period: 'Temmuz 2021 - Ekim 2021',
  },
  {
    company: 'Cestur Cesme Reconstruction Tourism',
    location: 'Çeşme, İzmir - Türkiye',
    period: 'Ağustos 2019 - Temmuz 2021',
  },
  {
    company: 'Inter Turquoise Travel',
    location: 'Menderes, İzmir - Türkiye',
    period: 'Temmuz 2017 - Eylül 2017',
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const restaurantBackgroundRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const updateRestaurantReveal = () => {
      const background = restaurantBackgroundRef.current;
      if (!background) return;

      const rect = background.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const entering = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * 0.45)));
      const leaving = Math.min(1, Math.max(0, rect.bottom / (viewportHeight * 0.45)));
      const visibility = Math.min(entering, leaving);
      const maxOpacity = window.innerWidth >= 1024 ? 0.15 : 0.25;

      background.style.opacity = String(visibility * maxOpacity);
    };

    updateRestaurantReveal();
    window.addEventListener('scroll', updateRestaurantReveal, { passive: true });
    window.addEventListener('resize', updateRestaurantReveal);

    return () => {
      window.removeEventListener('scroll', updateRestaurantReveal);
      window.removeEventListener('resize', updateRestaurantReveal);
    };
  }, []);

  useEffect(() => {
    const updateBackgroundReveal = () => {
      const section = sectionRef.current;
      const background = backgroundRef.current;
      if (!section || !background) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const entering = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * 0.5)));
      const leaving = Math.min(1, Math.max(0, rect.bottom / (viewportHeight * 0.5)));
      const visibility = Math.min(entering, leaving);
      const maxOpacity = window.innerWidth >= 1024 ? 0.24 : 0.42;

      background.style.opacity = String(visibility * maxOpacity);
    };

    updateBackgroundReveal();
    window.addEventListener('scroll', updateBackgroundReveal, { passive: true });
    window.addEventListener('resize', updateBackgroundReveal);

    return () => {
      window.removeEventListener('scroll', updateBackgroundReveal);
      window.removeEventListener('resize', updateBackgroundReveal);
    };
  }, []);

  return (
    <section
      id="experience"
      className="relative w-full py-32 overflow-hidden bg-black-matte"
      ref={sectionRef}
    >
      <div
        ref={backgroundRef}
        className="absolute inset-x-0 top-0 h-[40rem] bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-300 lg:inset-0 lg:h-auto"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/experience-wine-service.jpg)` }}
        aria-hidden="true"
      />
      <div
        ref={restaurantBackgroundRef}
        className="absolute inset-x-0 top-[40rem] h-[42rem] bg-black/55 bg-cover bg-center bg-no-repeat bg-blend-multiply opacity-0 transition-opacity duration-500 [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_78%,transparent_100%)] lg:top-[42rem] lg:h-[46rem]"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/experience-restaurant-interior.jpg)` }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-gradient-to-b from-black-matte/55 via-black-matte/80 to-black-matte lg:inset-0 lg:h-auto lg:bg-black-matte/85" aria-hidden="true" />
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
                    {/* Company */}
                    <div className="flex items-center gap-2 mb-4 lg:justify-start">
                      <Briefcase className="w-4 h-4 text-gold/60" />
                      <h3 className="text-gold-light font-medium">{exp.company}</h3>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

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
