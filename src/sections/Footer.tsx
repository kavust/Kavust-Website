import { ArrowUp } from 'lucide-react';

const navLinks = [
  { label: 'Ana Sayfa', href: '#home' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Hakkımda', href: '#about' },
  { label: 'Deneyim', href: '#experience' },
  { label: 'İletişim', href: '#contact' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full py-16 overflow-hidden bg-black-deep">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex flex-col items-center">
          {/* Logo - bigger */}
          <div className="mb-6">
            <img 
              src="https://i.postimg.cc/SKrXzX0j/IMG-2091.png" 
              alt="Logo" 
              className="h-24 w-auto opacity-80"
            />
          </div>

          {/* Name */}
          <h3 className="text-3xl font-serif text-white mb-1">İbrahim Kavüşt</h3>
          <p className="text-gold/60 text-xs tracking-[0.2em] uppercase mb-2">Uluslararası Sommelier</p>
          <p className="text-gray-500 text-sm mb-10">Restaurant Manager & Wine Consultant</p>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-8 mb-10">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-500 hover:text-gold transition-colors duration-300 text-xs tracking-[0.15em] uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-10" />

          {/* Copyright */}
          <p className="text-gray-600 text-xs tracking-wider">
            © 2024 İbrahim Kavüşt. Tüm hakları saklıdır.
          </p>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 border border-gold/50 text-gold hover:bg-gold hover:text-black-deep transition-all duration-300 z-50"
          aria-label="Yukarı çık"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
}
