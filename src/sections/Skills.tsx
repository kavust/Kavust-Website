import { useEffect, useRef, useState } from 'react';
import { 
  Palette, 
  Layout, 
  PenTool, 
  Camera, 
  Monitor, 
  Sparkles,
  Figma,
  Layers
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Grafik Tasarım',
    icon: Palette,
    skills: [
      { name: 'Adobe Photoshop', level: 95 },
      { name: 'Adobe Illustrator', level: 90 },
      { name: 'Adobe InDesign', level: 85 },
    ],
  },
  {
    title: 'UI/UX Tasarım',
    icon: Layout,
    skills: [
      { name: 'Figma', level: 95 },
      { name: 'Adobe XD', level: 88 },
      { name: 'Sketch', level: 80 },
    ],
  },
  {
    title: 'Marka Kimliği',
    icon: PenTool,
    skills: [
      { name: 'Logo Tasarımı', level: 92 },
      { name: 'Marka Stratejisi', level: 85 },
      { name: 'Kurumsal Kimlik', level: 90 },
    ],
  },
  {
    title: 'Dijital Medya',
    icon: Camera,
    skills: [
      { name: 'Fotoğrafçılık', level: 88 },
      { name: 'Video Edit', level: 82 },
      { name: 'Motion Graphics', level: 78 },
    ],
  },
];

const services = [
  {
    icon: Monitor,
    title: 'Web Tasarım',
    description: 'Modern ve kullanıcı dostu web arayüzleri tasarımı',
  },
  {
    icon: Figma,
    title: 'Prototipleme',
    description: 'Etkileşimli prototipler ve kullanıcı testleri',
  },
  {
    icon: Layers,
    title: 'Tasarım Sistemleri',
    description: 'Ölçeklenebilir ve tutarlı tasarım sistemleri',
  },
  {
    icon: Sparkles,
    title: 'Yaratıcı Danışmanlık',
    description: 'Markanız için stratejik yaratıcı çözümler',
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedSkills, setAnimatedSkills] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate skills progressively
          skillCategories.forEach((_, catIndex) => {
            catIndex;
            setTimeout(() => {
              setAnimatedSkills(prev => [...prev, catIndex]);
            }, catIndex * 200);
          });
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
      id="skills"
      className="relative w-full py-32 overflow-hidden"
      ref={sectionRef}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black-light" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-px h-64 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-1/3 right-0 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">Yetenekler</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-white mb-6">
            Uzmanlık <span className="text-gradient-gold">Alanlarım</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {skillCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              className={`group p-8 bg-black-card border border-gold/10 rounded-sm hover:border-gold/30 transition-all duration-500 hover:shadow-gold ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${catIndex * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gold/10 rounded-sm">
                  <category.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-serif text-white">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-sm">{skill.name}</span>
                      <span className="text-gold text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-black-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: animatedSkills.includes(catIndex) ? `${skill.level}%` : '0%',
                          transitionDelay: `${skillIndex * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-serif text-white text-center mb-12">
            Sunduğum <span className="text-gradient-gold">Hizmetler</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 bg-black-card border border-gold/10 rounded-sm hover:border-gold/30 transition-all duration-500 hover:shadow-gold text-center"
              >
                <div className="inline-flex p-4 bg-gold/10 rounded-full mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-gold" />
                </div>
                <h4 className="text-white font-medium mb-2">{service.title}</h4>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
