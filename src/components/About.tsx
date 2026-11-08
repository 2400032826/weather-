import React from 'react';
import { MapPin, Phone, CheckCircle2, Building2 } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-cream-100 text-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-forest-700" />
            <span>About Shriya Rice Mills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            A Dedicated Rice Milling Business in <span className="text-gold-600">Raichur</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest-800/80 leading-relaxed">
            Operating as a registered manufacturer situated in the Industrial Growth Center along the Raichur-Hyderabad corridor in Karnataka.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80"
                alt="Rice grain milling quality"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 text-white bg-forest-900/90 backdrop-blur-md p-4 rounded-xl border border-gold-500/30">
                <p className="text-xs text-gold-400 uppercase tracking-widest font-semibold">Registered Category</p>
                <p className="text-base font-serif font-bold">{BUSINESS_DETAILS.category}</p>
                <p className="text-xs text-cream-200/90 mt-1">Plot No. 116 & 117, Industrial Growth Center</p>
              </div>
            </div>

            {/* Floating Decorative Card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-premium border border-forest-100 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gold-500/20 text-gold-600 flex items-center justify-center font-bold">
                  🌾
                </div>
                <div>
                  <p className="text-xs font-semibold text-forest-950">{BUSINESS_DETAILS.kannadaName}</p>
                  <p className="text-[11px] text-forest-700/80">Raichur District, Karnataka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Factual Business Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-forest-100">
              <h3 className="text-2xl font-serif font-bold text-forest-950 mb-4">
                Serving the Grain Supply & Milling Sector
              </h3>
              
              <div className="space-y-4 text-forest-800/85 text-base leading-relaxed">
                <p>
                  <strong className="text-forest-950">SHRIYA RICE MILLS (ಶ್ರಿಯಾ ಅಕ್ಕಿ ಗಿರಣಿಗಳು)</strong> is a grain processing and rice milling manufacturer based in Raichur, Karnataka.
                </p>
                <p>
                  Raichur is historically recognized as one of Karnataka's prime rice production belts, nestled in the fertile river basin region between the Krishna and Tungabhadra rivers. The region cultivates extensive paddy varieties, creating steady demand for dependable milling infrastructure.
                </p>
                <p>
                  Situated at <span className="font-medium text-forest-950">Plot No. 116 & 117 in the Industrial Growth Center</span> along the Raichur-Hyderabad Road, the business is strategically placed for both local paddy intake and transportation to regional grain markets.
                </p>
              </div>

              {/* Factual Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-forest-100">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-forest-950">Business Category</h4>
                    <p className="text-xs text-forest-700/80">Manufacturer / Rice Mill</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-forest-950">Regional Hub</h4>
                    <p className="text-xs text-forest-700/80">Raichur-Hyderabad Road Corridor</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-forest-950">Google Rating</h4>
                    <p className="text-xs text-forest-700/80">3.0 / 5 (10 reviews on record)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-forest-950">Direct Contact</h4>
                    <p className="text-xs text-forest-700/80">+91 99455 96061</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4 mr-2 text-gold-400" />
                  <span>Call {BUSINESS_DETAILS.phone}</span>
                </a>
                
                <a
                  href="#contact"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-cream-200/80 hover:bg-cream-200 text-forest-950 font-semibold text-sm transition-colors border border-forest-200"
                >
                  <MapPin className="w-4 h-4 mr-2 text-forest-700" />
                  <span>View Mill Location</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
