import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const eventImages = [
  'https://lh3.googleusercontent.com/pw/AP1GczMwJkpEKBdWBC-NHWMgp-4X6zry2JbnnwcObFxumJCt1vqnGEjwm_HPiqY749AN5b1kJD2cksNQzqPToheMZxpBIfMu8iOn0visl08PlflmYt45xGVi=w900-h1350-no',
  'https://lh3.googleusercontent.com/pw/AP1GczPkbrlSqNr2chXbAW6eDP5pItwPT_MTRWpihYDeZR4E46441nb_dWAGp1C1cV0_scuJSOmusSQv__OiwNIeDrCuywCaX8g6KtsKmYi7Xg6tz1aOacYN=w1200-h800-no',
  'https://lh3.googleusercontent.com/pw/AP1GczOM8Hsp-bmJkAitIez6dvf-V_4kIMU1lJ0kq7alZsxqtEVOMcxRVtnlfap8LrXkfVFf7XXEGCgbB5wdvp0gi3X6dR9WPISqg8NnsODvPjrU7gAn3hja=w1200-h800-no',
];

export default function Events() {
  return (
    <section id="events" className="relative overflow-hidden bg-black-deep py-28 sm:py-36">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
        <div className="self-center">
          <span className="mb-6 inline-block text-xs uppercase tracking-[0.35em] text-gold">Events</span>
          <h2 className="mb-6 font-serif text-5xl leading-tight text-white sm:text-6xl">
            Seçilmiş <span className="text-gradient-gold italic">Akşamlar</span>
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-gray-400">
            Sommelier olarak yer aldığım özel etkinliklerden seçilmiş anlar, servis hikayeleri ve
            masanın arkasındaki hazırlık süreci.
          </p>

          <a
            href="/events/backblaze-executive-event"
            className="mt-10 inline-flex items-center gap-4 border border-gold/40 px-7 py-4 text-xs uppercase tracking-[0.24em] text-gold transition-all duration-300 hover:bg-gold hover:text-black-deep"
          >
            Eventi Gör
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <a
          href="/events/backblaze-executive-event"
          className="group relative block overflow-hidden border border-gold/20 bg-black-matte"
          aria-label="Backblaze executive private event sayfasını aç"
        >
          <div className="grid min-h-[34rem] grid-cols-6 grid-rows-6 gap-3 p-3">
            {eventImages.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden ${
                  index === 0
                    ? 'col-span-6 row-span-3'
                    : index === 1
                      ? 'col-span-3 row-span-3'
                      : 'col-span-3 row-span-3'
                }`}
              >
                <img
                  src={image}
                  alt="Backblaze executive private event"
                  className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mb-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-gold">
              <span className="inline-flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> 29 Eylül 2026</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> San Francisco</span>
            </div>
            <h3 className="font-serif text-3xl text-white sm:text-4xl">Backblaze Executive Private Event</h3>
          </div>
        </a>
      </div>
    </section>
  );
}
