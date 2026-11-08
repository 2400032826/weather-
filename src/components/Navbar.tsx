import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, MapPin, Sparkles } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Notification Bar for Concept Demo */}
      <div className="bg-forest-950 text-gold-300 text-xs py-1.5 px-4 border-b border-forest-800/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Website Concept Demo
            </span>
            <span className="hidden sm:inline text-cream-200">
              Designed for Shriya Rice Mills • Raichur, Karnataka
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${BUSINESS_DETAILS.phoneRaw}`} 
              className="text-gold-400 hover:text-gold-300 transition-colors font-medium flex items-center"
            >
              <Phone className="w-3 h-3 mr-1 text-gold-400" />
              {BUSINESS_DETAILS.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-7 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-forest-900/95 backdrop-blur-md shadow-premium border-b border-forest-800 py-3'
            : 'bg-forest-900 shadow-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <a href="#home" className="flex items-center space-x-3 group text-left">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                {/* Rice Grain Vector Icon */}
                <svg className="w-7 h-7 text-forest-950" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.5 2 6 6 6 11C6 16.5 9.5 21 12 22C14.5 21 18 16.5 18 11C18 6 15.5 2 12 2ZM12 4C14 4 16 7.5 16 11C16 14.8 13.8 18.5 12 19.8C10.2 18.5 8 14.8 8 11C8 7.5 10 4 12 4ZM11 6V16H13V6H11Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-wider font-bold text-lg sm:text-xl text-white group-hover:text-gold-400 transition-colors">
                  {BUSINESS_DETAILS.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gold-400 font-kannada text-xs font-semibold tracking-wide">
                    {BUSINESS_DETAILS.kannadaName}
                  </span>
                  <span className="text-white/40 text-[10px]">•</span>
                  <span className="text-cream-200/80 text-[11px] uppercase tracking-wider font-medium">
                    {BUSINESS_DETAILS.category}
                  </span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-gold-400 bg-forest-800'
                        : 'text-cream-100 hover:text-gold-400 hover:bg-forest-800/50'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href={BUSINESS_DETAILS.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Google Maps"
                className="hidden xl:flex items-center text-xs text-cream-200/90 hover:text-gold-400 px-2.5 py-1.5 rounded border border-forest-700/80 hover:border-gold-500/50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 mr-1 text-gold-400" />
                Raichur, Karnataka
              </a>
              <a
                href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <a
                href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md bg-gold-500 text-forest-950 hover:bg-gold-400"
                aria-label="Call Shriya Rice Mills"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-cream-100 hover:text-gold-400 hover:bg-forest-800 focus:outline-none"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-forest-950 border-t border-forest-800 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            <div className="px-3 py-2 bg-forest-900 rounded-lg mb-3">
              <p className="text-xs text-gold-300 font-semibold">SHRIYA RICE MILLS</p>
              <p className="text-xs text-cream-200">{BUSINESS_DETAILS.kannadaName}</p>
              <p className="text-[11px] text-cream-200/70 mt-1">{BUSINESS_DETAILS.address.full}</p>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-cream-100 hover:text-gold-400 hover:bg-forest-800 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-forest-800 space-y-2">
              <a
                href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-gold-500 text-forest-950 font-bold text-sm shadow-md"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now: {BUSINESS_DETAILS.phone}
              </a>
              <a
                href={BUSINESS_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold text-sm shadow-md"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
