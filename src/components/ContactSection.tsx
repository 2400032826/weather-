import React from 'react';
import { MapPin, Phone, MessageSquare, Navigation, Star, Building } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-cream-100 text-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-forest-700" />
            <span>Mill Location & Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Get in Touch with <span className="text-gold-600">Shriya Rice Mills</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest-800/80 leading-relaxed">
            Conveniently situated in Raichur's prime industrial zone along the Raichur-Hyderabad state highway.
          </p>
        </div>

        {/* Contact Information & Embedded Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Details Card */}
            <div className="bg-white rounded-3xl p-8 border border-forest-100 shadow-soft">
              <div className="border-b border-forest-100 pb-5 mb-6">
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-1">
                  Registered Manufacturing Unit
                </span>
                <h3 className="text-2xl font-serif font-bold text-forest-950">
                  {BUSINESS_DETAILS.name}
                </h3>
                <p className="font-kannada text-forest-700 font-semibold text-sm mt-0.5">
                  {BUSINESS_DETAILS.kannadaName}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-700 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-forest-700 font-bold">Mill Address</h4>
                    <p className="text-sm sm:text-base font-semibold text-forest-950 mt-1">
                      {BUSINESS_DETAILS.address.plot}, {BUSINESS_DETAILS.address.area}
                    </p>
                    <p className="text-xs sm:text-sm text-forest-800/85">
                      {BUSINESS_DETAILS.address.road}
                    </p>
                    <p className="text-xs sm:text-sm text-forest-800/85">
                      {BUSINESS_DETAILS.address.city}, {BUSINESS_DETAILS.address.state} - {BUSINESS_DETAILS.address.pincode}
                    </p>
                    
                    {/* Google Directions Button */}
                    <a
                      href={BUSINESS_DETAILS.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-forest-900 hover:text-gold-600 mt-2.5 transition-colors underline"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1 text-gold-600" />
                      Open in Google Maps Directions
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-forest-700 font-bold">Direct Phone Number</h4>
                    <p className="text-base sm:text-lg font-bold text-forest-950 mt-1">
                      {BUSINESS_DETAILS.phone}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <a
                        href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold shadow-sm transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        Click to Call
                      </a>
                      <a
                        href={BUSINESS_DETAILS.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-600 flex items-center justify-center shrink-0 mt-1">
                    <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-forest-700 font-bold">Google Maps Rating</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex text-gold-500">
                        <Star className="w-4 h-4 fill-gold-500" />
                        <Star className="w-4 h-4 fill-gold-500" />
                        <Star className="w-4 h-4 fill-gold-500" />
                        <Star className="w-4 h-4 text-cream-300" />
                        <Star className="w-4 h-4 text-cream-300" />
                      </div>
                      <span className="text-sm font-bold text-forest-950">
                        {BUSINESS_DETAILS.googleMapsRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <p className="text-xs text-forest-700/80 mt-0.5">
                      Based on {BUSINESS_DETAILS.reviewsCount} customer reviews on record
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Note */}
            <div className="bg-forest-900 text-white rounded-2xl p-5 border border-forest-800 shadow-md">
              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-gold-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Logistics & Heavy Vehicle Access</h4>
                  <p className="text-xs text-cream-200/80 mt-0.5">
                    Located in Industrial Growth Center with wide approach roads for truck freight and bulk paddy trailers.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Embedded Map Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-forest-100 shadow-soft p-3">
            <div className="relative rounded-2xl overflow-hidden h-[420px] lg:h-[540px] bg-forest-950">
              <iframe
                title="Shriya Rice Mills Location Map"
                src="https://maps.google.com/maps?q=Industrial+Growth+Center+Raichur+Karnataka+584134&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              
              {/* Map Floating Location Card */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-forest-100 shadow-lg text-left max-w-sm">
                <p className="text-xs font-bold text-forest-950">SHRIYA RICE MILLS</p>
                <p className="text-[11px] text-forest-700 mt-0.5">
                  Plot No. 116 & 117, Industrial Growth Center, Raichur-Hyderabad Rd, Raichur
                </p>
                <a
                  href={BUSINESS_DETAILS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[11px] font-bold text-gold-700 hover:text-gold-600 mt-1.5 underline"
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Get Turn-by-Turn Directions
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
