import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Eye } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Lüks Marka Kimliği',
    category: 'Marka Tasarımı',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80',
    description: 'Premium bir mücevher markası için kapsamlı marka kimliği tasarımı.',
  },
  {
    id: 2,
    title: 'E-Ticaret Platformu',
    category: 'UI/UX Tasarım',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description: 'Modern ve kullanıcı dostu bir e-ticaret deneyimi tasarımı.',
  },
  {
    id: 3,
    title: 'Kurumsal Web Sitesi',
    category: 'Web Tasarım',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    description: 'Uluslararası bir şirket için profesyonel web sitesi tasarımı.',
  },
  {
    id: 4,
    title: 'Mobil Uygulama',
    category: 'UI/UX Tasarım',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    description: 'Fintech mobil uygulaması için kullanıcı arayüzü tasarımı.',
  },
  {
    id: 5,
    title: 'Restoran Markası',
    category: 'Marka Tasarımı',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    description: 'Lüks bir restoran zinciri için marka kimliği ve menü tasarımı.',
  },
  {
    id: 6,
    title: 'Dijital Kampanya',
    category: 'Dijital Tasarım',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    description: 'Büyük ölçekli bir dijital pazarlama kampanyası görsel tasarımları.',
  },
];

const categories = ['Tümü', 'Marka Tasarımı', 'UI/UX Tasarım', 'Web Tasarım', 'Dijital Tasarım'];

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const filteredProjects = activeCategory === 'Tümü'
    ? projects
    : projects.filter(p => p.category === activeCategory);

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
      id="portfolio"
      className="relative w-full py-32 overflow-hidden"
      ref={sectionRef}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black-matte" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-gold/30 to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">Portfolio</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-white mb-6">
            Seçilmiş <span className="text-gradient-gold">Projelerim</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* Category filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm rounded-sm border transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gold text-black-matte border-gold'
                  : 'text-gray-400 border-gold/20 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black-matte via-black-matte/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Category */}
                  <span className="text-gold text-xs tracking-wider uppercase mb-2">
                    {project.category}
                  </span>
                  
                  {/* Title */}
                  <h3 className="text-xl font-serif text-white mb-2">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black-matte text-sm rounded-sm hover:bg-gold-light transition-colors">
                      <Eye className="w-4 h-4" />
                      Detay
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gold/50 text-gold text-sm rounded-sm hover:bg-gold/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Canlı
                    </button>
                  </div>
                </div>
              </div>

              {/* Border on hover */}
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/50 transition-all duration-500 rounded-sm pointer-events-none" />
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="group inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold rounded-sm hover:bg-gold hover:text-black-matte transition-all duration-300">
            <span>Tüm Projeleri Gör</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
