import React from 'react';
import { ArrowDown, Phone, MapPin, Star, ShieldCheck, Factory } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center bg-forest-950 text-white overflow-hidden">
      {/* Background Photography with Sophisticated Dark Forest Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=2000&q=85"
          alt="Golden paddy fields ready for harvest in Raichur"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered overlays: dark forest green gradient for optimal text contrast and rich branding */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/85 to-forest-950/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/60" />
      </div>

      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center sm:text-left flex flex-col justify-center">
        <div className="max-w-3xl">
          
          {/* Small Elegant Label: "Website Concept Demo" */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-forest-800/80 border border-gold-500/40 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span>Website Concept Demo</span>
          </div>

          {/* Subtitle / Kannada Name Identity */}
          <div className="flex flex-wrap items-center gap-3 mb-4 justify-center sm:justify-start">
            <span className="font-serif tracking-widest text-gold-400 font-semibold text-sm sm:text-base uppercase">
              {BUSINESS_DETAILS.name}
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="font-kannada text-cream-200 text-sm sm:text-base font-medium">
              {BUSINESS_DETAILS.kannadaName}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-forest-800/90 text-gold-300 border border-forest-700">
              <Factory className="w-3 h-3 mr-1 text-gold-400" />
              {BUSINESS_DETAILS.category}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-6">
            From Paddy to <span className="text-gold-400 italic">Quality Rice</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-cream-100/90 font-light max-w-2xl leading-relaxed mb-8">
            A Rice Milling Business in Raichur, Karnataka. Dedicated to delivering reliable milling operations and grain processing located at the Industrial Growth Center.
          </p>

          {/* CTAs: Explore Our Business & Contact Us */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start mb-12">
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-base shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center group"
            >
              <span>Explore Our Business</span>
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-forest-800/80 hover:bg-forest-700/90 text-white font-semibold text-base border border-gold-500/40 hover:border-gold-400 shadow-md transition-all duration-300 text-center flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2 text-gold-400" />
              <span>Contact Us</span>
            </a>
          </div>

          {/* Business Information Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-forest-800/80">
            {/* Location */}
            <div className="flex items-center space-x-3 bg-forest-900/60 backdrop-blur-sm p-3 rounded-lg border border-forest-800/60">
              <div className="p-2 rounded bg-gold-500/10 text-gold-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-cream-200/70 uppercase tracking-wider font-medium">Location</p>
                <p className="text-xs sm:text-sm font-semibold text-white truncate">Industrial Growth Center, Raichur</p>
              </div>
            </div>

            {/* Google Rating */}
            <div className="flex items-center space-x-3 bg-forest-900/60 backdrop-blur-sm p-3 rounded-lg border border-forest-800/60">
              <div className="p-2 rounded bg-gold-500/10 text-gold-400">
                <Star className="w-5 h-5 fill-gold-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-cream-200/70 uppercase tracking-wider font-medium">Google Maps Rating</p>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  3.0 / 5 <span className="text-cream-200/60 font-normal">({BUSINESS_DETAILS.reviewsCount} reviews)</span>
                </p>
              </div>
            </div>

            {/* Business Category */}
            <div className="flex items-center space-x-3 bg-forest-900/60 backdrop-blur-sm p-3 rounded-lg border border-forest-800/60">
              <div className="p-2 rounded bg-gold-500/10 text-gold-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-cream-200/70 uppercase tracking-wider font-medium">Business Category</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Manufacturer</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
