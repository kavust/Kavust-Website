import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Wine, Users, Sparkles } from 'lucide-react';

const gallery = [
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczOM8Hsp-bmJkAitIez6dvf-V_4kIMU1lJ0kq7alZsxqtEVOMcxRVtnlfap8LrXkfVFf7XXEGCgbB5wdvp0gi3X6dR9WPISqg8NnsODvPjrU7gAn3hja=w1200-h800-no', span: 'lg:col-span-7', alt: 'Private dinner table during the Backblaze executive event' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczPITVQQBMhFTeGxnR1_07s3T_NNhiDNzTkutPux-rWoztReEwVOBe4v4EnICmQEshuU8-2wUxOKZSipD7O2-Ba-Vi4wWuF8UghilIaHWkWWqgu6ibGn=w1200-h800-no', span: 'lg:col-span-5', alt: 'Printed tasting menu on a place setting' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczOQ5FrA7TgfYc641kb7vAd9EQkCMFh7Lwmcg4S4Zi7BEfawwQnAyjbgQ1g4GNRyc5NWpHKz3sfhS5BLttPgIGhVW4wvm5sdsIPEdHyXu3q70fARQiU1=w800-h1200-no', span: 'lg:col-span-4', alt: 'Passed appetizers prepared for the event' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczOj20JDqZsuRXgN6M93MUAuAPRF5yB8s7gdIUmGZQbQEu2rwPxUZWwytd3UEpfhJzyJZ8y2ja3C258MbVKKIP6FVC_PGRfptfaj761RaPxLVhFC7AiV=w1200-h800-no', span: 'lg:col-span-4', alt: 'Food pairing detail served at the event' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczPvUMtJrwE1bKaX0KuBkskqGDj4S7aQwyOiEGad9H5ZRvuevodE9uWrUvtGcFxsRKXGa8q-_JdXbY4TkjK3LKISmTtmUntbQHFGOHArOP4ammvvUHXY=w1200-h800-no', span: 'lg:col-span-4', alt: 'Austin Hope Cabernet Sauvignon bottle' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczN1bhkx9wnc56YiiS6VNRrfiWx3wtgoU_z7D1mAjhdifs97iLuOpZFzVmp0BvN_pv3hCoB4t-D8hd_O9GHR0tuzwPqgdcvbKIEmZgF_kHs-WTdU0BvK=w1200-h800-no', span: 'lg:col-span-6', alt: 'Guests gathering before dinner in San Francisco' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczODiB0DrDY5GIpQwvBr_Obw_eTxQgu2o_UF8IVjdXJTxThlBYtjonCbBmMaM8y9V8h056RGhHSWcZcQtfW9klv0O6Bvi_TI0J4HuqT4Uk6YnkVupkSR=w1200-h800-no', span: 'lg:col-span-6', alt: 'Guests in conversation during reception' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczMwJkpEKBdWBC-NHWMgp-4X6zry2JbnnwcObFxumJCt1vqnGEjwm_HPiqY749AN5b1kJD2cksNQzqPToheMZxpBIfMu8iOn0visl08PlflmYt45xGVi=w800-h1200-no', span: 'lg:col-span-4', alt: 'Reception scene with executives and guests' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczPkbrlSqNr2chXbAW6eDP5pItwPT_MTRWpihYDeZR4E46441nb_dWAGp1C1cV0_scuJSOmusSQv__OiwNIeDrCuywCaX8g6KtsKmYi7Xg6tz1aOacYN=w1200-h800-no', span: 'lg:col-span-4', alt: 'Sommelier presentation at the private dinner' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczOF8LX_x87tt8GHyvB5_27_PzsW_75TsHSKW14puUVLs2kTKaI8eEmWkB8X0L1e2hz57vkmAclXt1O0-qcinclD-rtu0rNGtQCTmFlAha93Iv3iaw9v=w1200-h800-no', span: 'lg:col-span-4', alt: 'İbrahim Kavüşt speaking to dinner guests' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczMM-dYFE8zo2zixTTXVBSJ3kfQQ66Vkbzb-aYWuVRKP4g3n0WRcnP3Zg6kMiBQsQwp7PyUY8X4ILxt-1PSStnDOaenFgFK8aJBM7Iwkn2uZIQS-6t_x=w1200-h800-no', span: 'lg:col-span-7', alt: 'Dinner room during the wine presentation' },
  { file: 'https://lh3.googleusercontent.com/pw/AP1GczOS51S3jw_bgtpo3BIXDOeGO-OdiH4vtdx155yOQflLC2ZelUEBjb0IpPLqmxree-L9zd2kT6s_4UslwVnJPSMxqcNTZT6-7ogh5rLEimmlz_1UlIxr=w1200-h800-no', span: 'lg:col-span-5', alt: 'Long table private executive dinner in San Francisco' },
];

const heroImage = gallery[11].file;

const notes = [
  {
    icon: Wine,
    title: 'Wine Direction',
    copy: 'Akşamın ritmi, seçkilerin masadaki yemekle doğal şekilde konuşması üzerine kuruldu. Her servis, teknik bilgiyle sade ve ulaşılabilir bir anlatım arasında tutuldu.',
  },
  {
    icon: Users,
    title: 'Executive Room',
    copy: 'Backblaze önderliğinde gerçekleşen özel davette atmosfer samimi, odaklı ve seçkindi. Amaç gösterişli bir sunumdan çok, masada güven veren bir akış oluşturmaktı.',
  },
  {
    icon: Sparkles,
    title: 'Service Memory',
    copy: 'Geceden geriye kalan kareler; hazırlığı, tadımı, sohbeti ve servis anındaki konsantrasyonu bir araya getiriyor.',
  },
];

interface BackblazeEventProps {
  onNavigate: (path: string) => void;
}

export default function BackblazeEvent({ onNavigate }: BackblazeEventProps) {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.event-reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const image = parallaxRef.current;
      const section = heroRef.current;
      if (!image || !section) return;

      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      image.style.transform = `scale(1.08) translateY(${(progress - 0.5) * 34}px)`;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate('/');
  };

  return (
    <article className="bg-black-deep text-white">
      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-20">
        <img
          ref={parallaxRef}
          src={heroImage}
          alt="Backblaze executive private dinner"
          className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black-deep/70 via-black-deep/45 to-black-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(8,8,8,0.42)_55%,#080808_100%)]" />

        <div className={`relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-end px-8 pb-20 transition-all duration-1000 lg:px-16 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <a
            href="/"
            onClick={goHome}
            className="mb-12 inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.22em] text-gold transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana sayfaya dön
          </a>

          <span className="mb-5 inline-block text-xs uppercase tracking-[0.35em] text-gold">Executive Private Event</span>
          <h1 className="max-w-5xl font-serif text-5xl leading-tight text-white sm:text-7xl lg:text-8xl">
            Backblaze ile San Francisco’da <span className="text-gradient-gold italic">özel bir akşam</span>
          </h1>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2 border border-gold/20 bg-black/30 px-4 py-2 backdrop-blur">
              <Calendar className="h-4 w-4 text-gold" /> 29 Eylül 2026
            </span>
            <span className="inline-flex items-center gap-2 border border-gold/20 bg-black/30 px-4 py-2 backdrop-blur">
              <MapPin className="h-4 w-4 text-gold" /> San Francisco
            </span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute left-1/2 top-0 h-24 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-14 px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
          <div className="sticky top-28 self-start">
            <span className="mb-5 inline-block text-xs uppercase tracking-[0.3em] text-gold">Hikaye</span>
            <h2 className="font-serif text-4xl leading-tight text-white sm:text-6xl">
              Servisin arkasındaki <span className="text-gradient-gold italic">sessiz ritim</span>
            </h2>
          </div>

          <div className="space-y-8 text-lg leading-relaxed text-gray-400">
            <p>
              Backblaze önderliğinde San Francisco’da düzenlenen bu executive private event, kalabalık
              bir gösteriden çok iyi kurulmuş bir masanın sakin gücünü taşıyordu. Akşamın merkezinde
              doğru zamanda yapılan servis, doğru tonda anlatılan şarap ve konukların sohbetine alan
              açan zarif bir akış vardı.
            </p>
            <p>
              Sommelier olarak rolüm yalnızca şişeleri tanıtmak değildi. Yemeğin temposunu okumak,
              masanın enerjisini hissetmek ve her eşleşmeyi davetin atmosferine yaklaştırmak gerekiyordu.
              Seçkiler, yemeği tamamlayan bir detay olmaktan çıkıp gecenin hafızasında kalan küçük
              duraklara dönüştü.
            </p>
            <p>
              Bu kareler o akşamdan geriye kalan profesyonel bir kayıt gibi: hazırlık, tabaklar, misafirler,
              konuşmalar ve servis anında kurulan güven. Benim için iyi bir event; gösterişten çok,
              bitişinde masada iyi bir iz bırakabilen eventtir.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-12 lg:px-16">
        <div className="grid gap-5 md:grid-cols-3">
          {notes.map((note) => {
            const Icon = note.icon;
            return (
              <div key={note.title} className="border border-gold/10 bg-black-matte/80 p-7 transition-all duration-500 hover:border-gold/35">
                <Icon className="mb-5 h-6 w-6 text-gold" />
                <h3 className="mb-3 text-lg font-medium text-white">{note.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{note.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-24 lg:px-16">
        <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-gold">Fotoğraflar</span>
            <h2 className="font-serif text-4xl text-white sm:text-6xl">
              Geceden <span className="text-gradient-gold italic">Kalanlar</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-500">
            Kaydırdıkça kareler hafifçe açılır; detaylar, masa atmosferi ve sunum anları aynı hikayenin parçaları gibi ilerler.
          </p>
        </div>

        <div className="event-gallery grid grid-cols-1 gap-5 lg:grid-cols-12">
          {gallery.map((image, index) => (
            <figure
              key={image.file}
              className={`event-reveal group relative min-h-[24rem] overflow-hidden border border-gold/10 bg-black-matte ${image.span}`}
              style={{ transitionDelay: `${Math.min(index * 45, 360)}ms` }}
            >
              <img
                src={image.file}
                alt={image.alt}
                loading={index > 2 ? 'lazy' : 'eager'}
                className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            </figure>
          ))}
        </div>
      </section>
    </article>
  );
}
