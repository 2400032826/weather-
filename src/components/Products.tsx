import React from 'react';
import { Package, AlertCircle, MessageSquare, ArrowRight, Check, Info } from 'lucide-react';
import { PRODUCTS_DATA, BUSINESS_DETAILS } from '../data/businessData';

export const Products: React.FC = () => {
  const handleWhatsAppInquiry = (productTitle: string) => {
    const text = encodeURIComponent(
      `Hello Shriya Rice Mills, I would like to enquire about ${productTitle} availability, specifications, and pricing.`
    );
    window.open(`https://wa.me/${BUSINESS_DETAILS.phoneRaw}?text=${text}`, '_blank');
  };

  return (
    <section id="products" className="py-20 lg:py-28 bg-white text-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/15 text-forest-900 text-xs font-bold uppercase tracking-wider mb-3 border border-gold-500/30">
            <Package className="w-3.5 h-3.5 text-gold-600" />
            <span>Product Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Our Core <span className="text-forest-700">Product Categories</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest-800/80 leading-relaxed">
            Proposed product categories representing grain milling operations. Specific varieties, packaging options, and bulk pricing are awaiting confirmation from the business owner.
          </p>
        </div>

        {/* Prominent Verification Notice Banner */}
        <div className="mb-12 bg-cream-100 border border-gold-400/50 rounded-xl p-4 sm:p-5 flex items-start space-x-4 shadow-soft">
          <AlertCircle className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h3 className="font-semibold text-forest-950">Notice for Website Visitors & Business Owner</h3>
            <p className="text-forest-800/80 mt-1">
              The products listed below display proposed website categories. Shriya Rice Mills does not make claims of specific varieties or immediate stock on this concept demo. Exact varieties (e.g., Sona Masoori, Raw, Steam, Broken) and batch rates can be verified directly via phone or WhatsApp inquiry.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((product) => (
            <div
              key={product.id}
              className="bg-cream-50 rounded-2xl overflow-hidden border border-forest-100/80 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative h-60 overflow-hidden bg-forest-950">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-forest-900 shadow-sm backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mr-1.5" />
                    Proposed Category
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold">{product.subtitle}</p>
                  <h3 className="text-2xl font-serif font-bold text-white">{product.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-forest-800/85 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Proposed Details */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1 text-gold-600" />
                      Scope Details:
                    </p>
                    <ul className="space-y-1.5">
                      {product.proposedItems.map((item, index) => (
                        <li key={index} className="flex items-start text-xs text-forest-800/80">
                          <Check className="w-3.5 h-3.5 text-forest-600 mr-2 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-forest-100 space-y-3">
                  <div className="bg-gold-500/10 p-2.5 rounded-lg border border-gold-500/20">
                    <p className="text-[11px] text-forest-800/90 italic text-center">
                      "{product.specStatus}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleWhatsAppInquiry(product.title)}
                    className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-white font-medium text-sm transition-colors shadow-sm group/btn"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-gold-400" />
                    <span>Inquire About {product.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Order / Bulk Info Callout */}
        <div className="mt-16 bg-forest-900 rounded-2xl p-8 sm:p-10 text-white shadow-premium relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">Bulk Supply & Custom Milling</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1">Have Specific Variety Requirements?</h3>
              <p className="text-cream-200/80 text-sm sm:text-base mt-2 max-w-2xl">
                Get in touch with Shriya Rice Mills to confirm currently processed lots, delivery schedules, and commercial wholesale inquiries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-sm shadow transition-all"
              >
                Call: {BUSINESS_DETAILS.phone}
              </a>
              <a
                href={BUSINESS_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-forest-800 hover:bg-forest-700 text-white border border-forest-600 font-semibold text-sm transition-all"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>
    </section>
  );
};
