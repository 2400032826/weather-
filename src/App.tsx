import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Products } from './components/Products';
import { Facilities } from './components/Facilities';
import { Gallery } from './components/Gallery';
import { EnquirySection } from './components/EnquirySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingLeadBar } from './components/FloatingLeadBar';

export function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'products', 'facilities', 'gallery', 'enquiry', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans selection:bg-gold-500 selection:text-forest-900">
      {/* Navigation Header */}
      <Navbar activeSection={activeSection} />

      {/* Main Page Sections */}
      <main className="flex-grow">
        <Hero />
        <About />
        <Products />
        <Facilities />
        <Gallery />
        <EnquirySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Floating Lead Generation Actions */}
      <FloatingLeadBar />
    </div>
  );
}

export default App;
