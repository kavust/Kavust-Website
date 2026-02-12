import { useEffect, useRef, useState } from 'react';
import { Award, GraduationCap, Globe, Users } from 'lucide-react';

const stats = [
  { value: '10+', label: 'Yıllık Deneyim' },
  { value: '3', label: 'Ülke' },
  { value: '6+', label: 'Kurumsal Rol' },
];

export default function About() {
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
      id="about"
      className="relative w-full py-32 overflow-hidden bg-black-deep"
      ref={sectionRef}
    >
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gold/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-gold text-xs tracking-[0.3em] uppercase mb-6">Hakkımda</span>
          <h2 className="text-5xl sm:text-6xl font-serif text-white mb-6">
            Profesyonel <span className="text-gradient-gold italic">Yolculuğum</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/50" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="w-12 h-px bg-gold/50" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - About content */}
          <div className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Merhaba, ben <span className="text-gold font-medium">İbrahim Kavüşt</span>. 
                Uluslararası sertifikalı bir Sommelier ve otel/restoran yönetimi alanında 
                kapsamlı deneyime sahip bir profesyonelim.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The Barrel Bistro and Wine Bar'da Service Manager olarak görev yaparken, 
                öncesinde Dubai Le Meridien Mina Seyahi Beach Resort & Waterpark'da 
                Supervisor pozisyonunda çalıştım. EXPO 2020 Dubai'de Marriott 
                International bünyesinde de değerli deneyimler kazandım.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Türkiye'de Esen Tourism'de Restaurant Manager ve Cestur Cesme'de 
                Restaurant Captain olarak görev aldım. Misafir memnuniyeti, ekip 
                yönetimi, şarap bilgisi ve operasyonel mükemmellik konularında uzmanlaştım.
              </p>
            </div>

            {/* Quote */}
            <div className="relative pl-6 border-l border-gold/50 py-2">
              <p className="text-gold-light italic text-xl font-serif">
                "Hizmet bir sanattır ve her masada unutulmaz bir hikaye yatar."
              </p>
            </div>

            {/* Education */}
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-5 h-5 text-gold" />
                <span className="text-white font-medium">Eğitim</span>
              </div>
              <div className="space-y-3 pl-8">
                <div>
                  <p className="text-gray-300">Manisa Celal Bayar University</p>
                  <p className="text-gray-500 text-sm">2021</p>
                </div>
                <div>
                  <p className="text-gray-300">Turkbirligi Anatolian High School</p>
                  <p className="text-gray-500 text-sm">2016</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Stats & Info */}
          <div className={`space-y-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 border border-gold/10 hover:border-gold/30 transition-all duration-500"
                >
                  <p className="text-4xl font-serif text-gradient-gold mb-2">{stat.value}</p>
                  <p className="text-gray-500 text-xs tracking-wider uppercase">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="p-8 border border-gold/10 bg-black-card/50">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-gold" />
                <span className="text-white font-medium tracking-wide">Yetkinliklerim</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Dedication', 'Guest Satisfaction', 'Confidence', 'Team Leadership', 'Operations Management', 'Fine Dining Service', 'Wine Expertise', 'Sommelier'].map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 border border-gold/30 text-gold/80 text-sm hover:bg-gold/10 hover:border-gold/50 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* International Experience */}
            <div className="flex items-start gap-4 p-6 border border-gold/10">
              <Globe className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-white font-medium mb-1">Uluslararası Deneyim</p>
                <p className="text-gray-400">ABD, Dubai (BAE) ve Türkiye'de profesyonel görevler</p>
              </div>
            </div>

            {/* Team Management */}
            <div className="flex items-start gap-4 p-6 border border-gold/10">
              <Users className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-white font-medium mb-1">Ekip Yönetimi</p>
                <p className="text-gray-400">Profesyonel ekip eğitimi ve operasyonel liderlik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
