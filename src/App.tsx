import { useEffect, useState } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Experience from './sections/Experience';
import Events from './sections/Events';
import BackblazeEvent from './sections/BackblazeEvent';
import Contact from './sections/Contact';
import WineAtlas from './sections/WineAtlas';
import Footer from './sections/Footer';
import { translatePage } from './i18n';
import type { Language } from './i18n';

function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kavust-language');
    if (saved === 'tr' || saved === 'en') return saved;
    return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  });

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (nextPath: string) => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
      setPath(nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('kavust-language', language);
    translatePage(language);
    const options = { childList: true, subtree: true, characterData: true };
    const observer = new MutationObserver((records) => {
      const relevant = records.some(record => {
        const element = record.target instanceof Element ? record.target : record.target.parentElement;
        return !element?.closest('textarea, input, select, [contenteditable], script, style');
      });
      if (!relevant) return;
      observer.disconnect();
      try {
        translatePage(language);
      } finally {
        observer.observe(document.body, options);
      }
    });
    observer.observe(document.body, options);
    return () => observer.disconnect();
  }, [language]);

  const isEventPage = path.includes('/events/backblaze-executive-event');

  return (
    <div className="min-h-screen bg-black-deep text-white overflow-x-hidden">
      <Navigation language={language} onLanguageChange={setLanguage} onNavigate={navigateTo} />
      <main>
        {isEventPage ? (
          <BackblazeEvent onNavigate={navigateTo} />
        ) : (
          <>
            <Hero />
            <Services />
            <About />
            <Experience />
            <Events />
            <WineAtlas language={language} />
            <Contact />
          </>
        )}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
