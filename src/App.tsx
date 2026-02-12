import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black-deep text-white overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
