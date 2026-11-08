import React, { useState } from 'react';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_DATA, type GalleryItem } from '../data/businessData';

export const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeImageModal, setActiveImageModal] = useState<GalleryItem | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'paddy', label: 'Golden Paddy' },
    { id: 'rice', label: 'Rice Grains' },
    { id: 'milling', label: 'Milling & Processing' },
    { id: 'storage', label: 'Storage & Handling' },
  ];

  const filteredItems = activeFilter === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.category === activeFilter);

  const handleNextImage = () => {
    if (!activeImageModal) return;
    const currentIndex = GALLERY_DATA.findIndex((item) => item.id === activeImageModal.id);
    const nextIndex = (currentIndex + 1) % GALLERY_DATA.length;
    setActiveImageModal(GALLERY_DATA[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!activeImageModal) return;
    const currentIndex = GALLERY_DATA.findIndex((item) => item.id === activeImageModal.id);
    const prevIndex = (currentIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
    setActiveImageModal(GALLERY_DATA[prevIndex]);
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white text-forest-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5 text-forest-700" />
            <span>Visual Tour</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Industry & Grain <span className="text-gold-600">Gallery</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-forest-800/80 leading-relaxed">
            High-definition visual representations of golden harvest fields, processed rice grains, milling setups, and storage handling.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === tab.id
                  ? 'bg-forest-900 text-gold-400 shadow-md scale-105'
                  : 'bg-cream-100 text-forest-800 hover:bg-cream-200/80 border border-forest-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImageModal(item)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-premium transition-all duration-300 bg-forest-950 aspect-[4/3]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
              
              {/* Category Pill */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-forest-900/80 text-gold-300 backdrop-blur-md border border-forest-700">
                  {item.categoryLabel}
                </span>
              </div>

              {/* Zoom Icon Button */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-75 duration-300">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-lg font-serif font-bold text-white group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-cream-200/90 line-clamp-2 mt-1">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImageModal && (
          <div className="fixed inset-0 z-50 bg-forest-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-forest-900 text-cream-100 hover:text-gold-400 hover:bg-forest-800 transition-colors z-20"
              aria-label="Close image modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-forest-900/80 text-white hover:text-gold-400 hover:bg-forest-800 transition-colors z-20 hidden sm:flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-forest-900/80 text-white hover:text-gold-400 hover:bg-forest-800 transition-colors z-20 hidden sm:flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="max-w-4xl w-full bg-forest-900 rounded-2xl overflow-hidden border border-forest-800 shadow-2xl relative">
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeImageModal.image}
                  alt={activeImageModal.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="p-6 bg-forest-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gold-400 font-bold">
                    {activeImageModal.categoryLabel}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                    {activeImageModal.title}
                  </h3>
                  <p className="text-sm text-cream-200/90 mt-1">
                    {activeImageModal.caption}
                  </p>
                </div>
                <div className="shrink-0 flex items-center space-x-2">
                  <span className="text-xs text-cream-200/60">
                    Shriya Rice Mills Gallery Concept
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
