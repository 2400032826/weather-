import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, Check } from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import { pwaInstallManager, type InstallOutcome } from '../lib/pwaInstall';

interface InstallAppBannerProps {
  currentLang: Language;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [isInstalled, setIsInstalled] = useState<boolean>(true); // default true until verified client-side to prevent flash
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to install state changes
    const unsubscribe = pwaInstallManager.subscribe((installed) => {
      setIsInstalled(installed);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // If already installed, hide completely
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const outcome: InstallOutcome = await pwaInstallManager.promptInstall();

      if (outcome === 'accepted') {
        // App installation accepted by user
        setIsInstalled(true);
      } else if (outcome === 'ios_guide') {
        // iOS Safari manual instructions modal
        setShowIosModal(true);
      } else if (outcome === 'dismissed') {
        // User cancelled the prompt. Do not mark as installed.
      } else {
        // Fallback for browsers that don't support beforeinstallprompt
        if (pwaInstallManager.isIOS()) {
          setShowIosModal(true);
        } else {
          // Instruct user to look for the browser's install icon or menu
          alert(
            currentLang === 'te'
              ? 'మీ బ్రౌజర్ మెనూ (⋮) ఓపెన్ చేసి "Install app" లేదా "Add to Home screen" ఎంచుకోండి.'
              : currentLang === 'kn'
              ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಮೆನು (⋮) ತೆರೆದು "Install app" ಅಥವಾ "Add to Home screen" ಆಯ್ಕೆಮಾಡಿ.'
              : 'Open your browser menu (⋮) and select "Install app" or "Add to Home screen".'
          );
        }
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleConfirmIosInstall = () => {
    pwaInstallManager.markAsInstalled();
    setIsInstalled(true);
    setShowIosModal(false);
  };

  return (
    <>
      {/* First-Time Visitor Install Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm sm:text-base tracking-tight text-white">
                {t.installAppBtn}
              </h3>
              <span className="text-[10px] bg-emerald-700/80 text-emerald-200 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                PWA
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 mt-0.5 font-medium leading-relaxed truncate sm:whitespace-normal">
              {t.installAppSubtitle}
            </p>
          </div>
        </div>

        {/* Action Button (Min 48px touch target) */}
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 transition active:scale-95 shadow-md border border-amber-300 shrink-0"
          aria-label={t.installAppBtn}
        >
          <Download className="w-4 h-4 text-slate-950" />
          <span>{t.installAppBtn}</span>
        </button>
      </section>

      {/* iOS Safari Installation Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-base text-slate-900">
                  {t.iosInstallTitle}
                </h4>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <p className="font-medium text-xs leading-relaxed">
                  {t.iosStep1}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <p className="font-medium text-xs leading-relaxed">
                  {t.iosStep2}
                </p>
              </div>
            </div>

            {/* Confirmation actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleConfirmIosInstall}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl font-black text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{t.iHaveInstalled}</span>
              </button>
              <button
                onClick={() => setShowIosModal(false)}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                {t.closeGuide}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
