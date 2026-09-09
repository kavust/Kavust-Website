import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { Language } from '@/i18n';

const navLinks = [
  { label: 'Ana Sayfa', href: '#home' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Hakkımda', href: '#about' },
  { label: 'Deneyim', href: '#experience' },
  { label: 'İletişim', href: '#contact' },
];

interface NavigationProps { language: Language; onLanguageChange: (language: Language) => void; }

export default function Navigation({ language, onLanguageChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navLinks.map(link => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black-deep/95 backdrop-blur-md border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3"
            >
              <picture>
                <source media="(max-width: 767px)" srcSet={`${import.meta.env.BASE_URL}images/kavust-logo-mobile.png`} />
                <img 
                  src={`${import.meta.env.BASE_URL}images/kavust-logo-v2.png`}
                  alt="İbrahim Kavüşt" 
                  className="h-16 w-auto opacity-90 md:h-10"
                />
              </picture>
              <div className="hidden sm:block">
                <span className="text-lg font-serif text-white/90 block leading-tight">
                  İbrahim <span className="text-gold">Kavüşt</span>
                </span>
                <span className="text-gold/60 text-[10px] tracking-[0.2em] uppercase">
                  Uluslararası Sommelier
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-gold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <button onClick={() => onLanguageChange(language === 'tr' ? 'en' : 'tr')} className="border border-gold/30 px-2 py-1 text-[10px] tracking-wider text-gold hover:bg-gold hover:text-black-deep transition-colors" aria-label="Change language">
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => onLanguageChange(language === 'tr' ? 'en' : 'tr')} className="px-2 py-1 text-[10px] tracking-wider text-gold" aria-label="Change language">{language === 'tr' ? 'EN' : 'TR'}</button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-[opacity,visibility] duration-200 ease-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-black-deep/60 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className="relative h-full flex flex-col items-center justify-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-2xl font-serif tracking-wide transition-all duration-300 ${
                activeSection === link.href.replace('#', '')
                  ? 'text-gold'
                  : 'text-white hover:text-gold'
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
