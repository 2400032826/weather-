import React from 'react';
import { Cog, CheckCircle, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { FACILITIES_DATA, BUSINESS_DETAILS } from '../data/businessData';

export const Facilities: React.FC = () => {
  return (
    <section id="facilities" className="py-20 lg:py-28 bg-cream-100 text-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Cog className="w-3.5 h-3.5 text-forest-700" />
            <span>Infrastructure & Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Proposed Mill <span className="text-gold-600">Facilities</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest-800/80 leading-relaxed">
            Presented as proposed website categories designed to showcase standard modern rice mill capabilities once verified with the business owner.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="max-w-2xl mx-auto mb-14 bg-white/80 backdrop-blur-sm border border-forest-200/80 rounded-xl p-3.5 text-xs text-forest-800 flex items-center justify-center space-x-2 shadow-soft">
          <ShieldAlert className="w-4 h-4 text-gold-600 shrink-0" />
          <span className="text-center">
            <strong>Note:</strong> Specific machinery models, equipment make, and daily capacity figures are subject to verification upon business owner consultation.
          </span>
        </div>

        {/* Three Proposed Sections */}
        <div className="space-y-12">
          {FACILITIES_DATA.map((facility, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={facility.id}
                className={`bg-white rounded-3xl overflow-hidden border border-forest-100 shadow-soft hover:shadow-premium transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch ${
                  isReversed ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image Column */}
                <div className={`lg:col-span-6 relative min-h-[300px] lg:min-h-full ${isReversed ? 'lg:col-start-7' : ''}`}>
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent lg:hidden" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-forest-950/90 text-gold-400 backdrop-blur-md border border-gold-500/30">
                      Proposed Category {index + 1}
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between ${isReversed ? 'lg:col-start-1' : ''}`}>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold-600 font-bold block mb-1">
                      {facility.tagline}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 mb-4">
                      {facility.title}
                    </h3>
                    <p className="text-sm sm:text-base text-forest-800/85 leading-relaxed mb-6">
                      {facility.description}
                    </p>

                    {/* Proposed Checkpoints */}
                    <div className="space-y-3 mb-8">
                      <p className="text-xs uppercase font-bold text-forest-900 tracking-wider">
                        Key Operational Scope:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {facility.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start text-xs sm:text-sm text-forest-800/80">
                            <CheckCircle className="w-4 h-4 text-forest-600 mr-2 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer info box */}
                  <div className="pt-4 border-t border-forest-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-forest-700/80">
                    <span className="italic">"{facility.disclaimer}"</span>
                    <a
                      href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                      className="inline-flex items-center text-forest-900 font-semibold hover:text-gold-600 transition-colors"
                    >
                      <span>Inquire Facility Specs</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
