import React from 'react';
import { Phone, MapPin, MessageSquare, ArrowUp, Star, Shield, ExternalLink } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 pt-16 pb-24 md:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-800/80">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center text-forest-950 font-bold shadow-md">
                <svg className="w-6 h-6 text-forest-950" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.5 2 6 6 6 11C6 16.5 9.5 21 12 22C14.5 21 18 16.5 18 11C18 6 15.5 2 12 2ZM12 4C14 4 16 7.5 16 11C16 14.8 13.8 18.5 12 19.8C10.2 18.5 8 14.8 8 11C8 7.5 10 4 12 4ZM11 6V16H13V6H11Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-white tracking-wider">
                  {BUSINESS_DETAILS.name}
                </h3>
                <p className="font-kannada text-xs text-gold-400 font-semibold">
                  {BUSINESS_DETAILS.kannadaName}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed max-w-sm">
              A registered rice milling business and grain manufacturer located at the Industrial Growth Center in Raichur, Karnataka.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-forest-900 text-xs font-semibold text-gold-400 border border-forest-800">
                <Star className="w-3.5 h-3.5 fill-gold-400 mr-1" />
                {BUSINESS_DETAILS.googleMapsRating.toFixed(1)} / 5.0 Google Rating
              </span>
              <span className="text-xs text-cream-200/60">
                ({BUSINESS_DETAILS.reviewsCount} Reviews)
              </span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm text-cream-200/80">
              <li>
                <a href="#home" className="hover:text-gold-400 transition-colors">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gold-400 transition-colors">
                  About Shriya Rice Mills
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-gold-400 transition-colors">
                  Product Categories
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-gold-400 transition-colors">
                  Proposed Mill Facilities
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-gold-400 transition-colors">
                  Visual Gallery
                </a>
              </li>
              <li>
                <a href="#enquiry" className="hover:text-gold-400 transition-colors">
                  Customer Enquiry Form
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Direct Business Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-cream-200/80">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_DETAILS.address.full}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${BUSINESS_DETAILS.phoneRaw}`} className="hover:text-gold-400 font-semibold underline text-white">
                  {BUSINESS_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={BUSINESS_DETAILS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 text-cream-200 underline"
                >
                  Chat with Mill via WhatsApp
                </a>
              </div>
            </div>

            {/* Google Directions Link */}
            <div className="pt-2">
              <a
                href={BUSINESS_DETAILS.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-gold-300"
              >
                <span>Open Google Maps Directions</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Notice & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-200/60">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <Shield className="w-4 h-4 text-gold-400 shrink-0" />
            <span>
              <strong>Concept Demo:</strong> Prepared for Shriya Rice Mills (ಶ್ರಿಯಾ ಅಕ್ಕಿ ಗಿರಣಿಗಳು), Raichur, Karnataka.
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span>© {new Date().getFullYear()} SHRIYA RICE MILLS. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-forest-900 hover:bg-forest-800 text-gold-400 transition-colors"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
