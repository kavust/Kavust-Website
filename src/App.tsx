import { useEffect, useState } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Services from './sections/Services';
import WineSelection from './sections/WineSelection';
import About from './sections/About';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import { translatePage } from './i18n';
import type { Language } from './i18n';

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kavust-language');
    if (saved === 'tr' || saved === 'en') return saved;
    return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('kavust-language', language);
    translatePage(language);
    const observer = new MutationObserver(() => translatePage(language));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  return (
    <div className="min-h-screen bg-black-deep text-white overflow-x-hidden">
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main>
        <Hero />
        <Services />
        <WineSelection />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
