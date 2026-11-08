import React, { useState } from 'react';
import { MessageSquare, Phone, Send, CheckCircle } from 'lucide-react';
import { BUSINESS_DETAILS } from '../data/businessData';

export const EnquirySection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    enquiryType: 'Rice Purchase Enquiry',
    message: '',
  });

  const [submittedPreview, setSubmittedPreview] = useState<string | null>(null);

  const enquiryTypes = [
    'Rice Purchase Enquiry',
    'Paddy Milling Enquiry',
    'Bulk Supply & Wholesale',
    'Grain Processing / By-Products',
    'General Business Information',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      alert('Please provide your name and phone number to submit your enquiry.');
      return;
    }

    // Construct genuine WhatsApp message
    const formattedMessage = 
      `*New Business Enquiry for Shriya Rice Mills*\n\n` +
      `👤 *Name:* ${formData.fullName.trim()}\n` +
      `📞 *Phone:* ${formData.phoneNumber.trim()}\n` +
      `📋 *Enquiry Type:* ${formData.enquiryType}\n` +
      `💬 *Message:* ${formData.message.trim() || 'Requesting information regarding rice milling services and availability.'}\n\n` +
      `_Sent via Shriya Rice Mills Website_`;

    const encodedText = encodeURIComponent(formattedMessage);
    const targetUrl = `https://wa.me/${BUSINESS_DETAILS.phoneRaw}?text=${encodedText}`;

    setSubmittedPreview(formattedMessage);

    // Open WhatsApp in new tab
    window.open(targetUrl, '_blank');
  };

  return (
    <section id="enquiry" className="py-20 lg:py-28 bg-forest-950 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-800/80 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
            <span>Direct Business Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Looking for <span className="text-gold-400">Rice Milling Information?</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-cream-100/80 leading-relaxed">
            Connect with Shriya Rice Mills for business enquiries and more information. We are ready to assist with paddy milling, grain supply inquiries, and commercial partnerships.
          </p>

          {/* Instant Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href={`tel:${BUSINESS_DETAILS.phoneRaw}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-base shadow-elevated transition-all flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>Call Now: {BUSINESS_DETAILS.phone}</span>
            </a>

            <a
              href={BUSINESS_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base shadow-md transition-all flex items-center justify-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-forest-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-forest-800 shadow-2xl">
          <div className="mb-6 border-b border-forest-800 pb-4">
            <h3 className="text-xl font-serif font-bold text-white">Send an Enquiry Directly</h3>
            <p className="text-xs text-cream-200/70 mt-1">
              Fill out this form to immediately connect with our WhatsApp line with your exact requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1.5">
                Full Name <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 rounded-xl bg-forest-950/80 border border-forest-700 text-white placeholder-cream-200/40 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1.5">
                Phone Number <span className="text-gold-400">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-forest-950/80 border border-forest-700 text-white placeholder-cream-200/40 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="enquiryType" className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1.5">
                Enquiry Type
              </label>
              <select
                id="enquiryType"
                value={formData.enquiryType}
                onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-forest-950/80 border border-forest-700 text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              >
                {enquiryTypes.map((type) => (
                  <option key={type} value={type} className="bg-forest-900 text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-1.5">
                Message / Requirement Details
              </label>
              <textarea
                id="message"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry, requested quantities, or milling questions..."
                className="w-full px-4 py-3 rounded-xl bg-forest-950/80 border border-forest-700 text-white placeholder-cream-200/40 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-base shadow-lg transition-all duration-200 flex items-center justify-center group"
            >
              <span>Submit Enquiry via WhatsApp</span>
              <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Genuine Action Guarantee Note */}
          <div className="mt-4 pt-4 border-t border-forest-800 text-center">
            <p className="text-[11px] text-cream-200/70 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
              Submitting opens a pre-composed WhatsApp chat to <strong className="text-gold-300 ml-1">{BUSINESS_DETAILS.phone}</strong>
            </p>
          </div>

          {/* Submitted notification info */}
          {submittedPreview && (
            <div className="mt-4 p-4 rounded-xl bg-forest-800/90 border border-gold-500/40 animate-fadeIn">
              <p className="text-xs font-semibold text-gold-300">✅ Enquiry Prepared & WhatsApp Triggered!</p>
              <p className="text-[11px] text-cream-200/80 mt-1">
                Your message has been formatted and opened in WhatsApp. If it didn't open automatically, you can also call us directly at <a href={`tel:${BUSINESS_DETAILS.phoneRaw}`} className="underline text-gold-400 font-bold">{BUSINESS_DETAILS.phone}</a>.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
