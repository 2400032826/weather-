import React, { useState } from 'react';
import { Phone, MessageSquare, X, Send } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

export const FloatingLeadBar: React.FC = () => {
  const [chatPopupOpen, setChatPopupOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');

  const sendQuickWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      quickMsg.trim() || 'Hello Shriya Rice Mills, I am inquiring regarding rice milling and product availability.'
    );
    window.open(`https://wa.me/${BUSINESS_DETAILS.phoneRaw}?text=${text}`, '_blank');
    setChatPopupOpen(false);
    setQuickMsg('');
  };

  return (
    <>
      {/* Floating Desktop & Tablet WhatsApp Action Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-end">
        {/* Quick Pop-up Chat Dialog */}
        {chatPopupOpen && (
          <div className="mb-3 w-80 bg-forest-900 rounded-2xl shadow-elevated border border-gold-500/30 overflow-hidden text-white animate-fadeIn">
            {/* Header */}
            <div className="bg-forest-950 p-3.5 border-b border-forest-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Shriya Rice Mills WhatsApp</h4>
                  <p className="text-[10px] text-gold-400">Direct Mill Business Line</p>
                </div>
              </div>
              <button
                onClick={() => setChatPopupOpen(false)}
                className="text-cream-200/70 hover:text-white p-1"
                aria-label="Close chat popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={sendQuickWhatsApp} className="p-3.5 space-y-3">
              <p className="text-xs text-cream-200/90 leading-relaxed">
                Connect directly with Shriya Rice Mills in Raichur for prompt grain and milling queries:
              </p>
              <textarea
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                placeholder="Type your message or enquiry here..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg bg-forest-950 border border-forest-700 text-white placeholder-cream-200/40 focus:outline-none focus:border-gold-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </button>
            </form>
          </div>
        )}

        {/* WhatsApp Round Trigger */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:block bg-forest-950/90 text-white text-xs px-3 py-1.5 rounded-full border border-forest-800 shadow-md">
            <span className="text-gold-400 font-semibold">Need Rice Milling Info?</span> Chat Now
          </div>
          <button
            onClick={() => setChatPopupOpen(!chatPopupOpen)}
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-elevated flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-300 relative group"
            aria-label="Chat on WhatsApp"
          >
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-400 rounded-full border-2 border-forest-950" />
            <MessageSquare className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Sticky Mobile Lead Bar (Visible only on mobile screens < 768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-forest-950/95 backdrop-blur-md border-t border-forest-800 py-2.5 px-3 shadow-2xl flex items-center justify-between gap-2">
        {/* Call Now */}
        <a
          href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
          className="flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg bg-gold-500 active:bg-gold-600 text-forest-950 font-bold text-xs shadow"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          <span>Call Mill</span>
        </a>

        {/* WhatsApp */}
        <a
          href={BUSINESS_DETAILS.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg bg-[#25D366] active:bg-[#20bd5a] text-white font-bold text-xs shadow"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          <span>WhatsApp</span>
        </a>

        {/* Enquiry scroll */}
        <a
          href="#enquiry"
          className="flex-none px-3.5 py-2.5 rounded-lg bg-forest-800 text-gold-300 font-medium text-xs border border-forest-700"
        >
          Enquire
        </a>
      </div>
    </>
  );
};
