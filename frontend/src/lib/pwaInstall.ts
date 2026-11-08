/**
 * Raithu Alert - PWA Installation & Environment Detection
 * 
 * Manages:
 * - Standalone display mode detection (Android Chrome, iOS Safari, TWA)
 * - Persistent install state tracking (localStorage flag 'raithu_pwa_installed')
 * - 'beforeinstallprompt' interception and trigger
 * - 'appinstalled' event handling
 * - Clean edge-case prevention (never falsely mark installed on dismiss)
 */

export type InstallOutcome = 'accepted' | 'dismissed' | 'ios_guide' | 'unsupported';

type InstallListener = (isInstalled: boolean) => void;

class PwaInstallManager {
  private deferredPrompt: any = null;
  private isInstalledState: boolean = false;
  private listeners: Set<InstallListener> = new Set();
  private promptAvailableListeners: Set<(available: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init(): void {
    // Check initial installation state
    this.isInstalledState = this.checkIsInstalled();

    // Listen for display-mode changes (e.g. user enters standalone)
    try {
      const matchMediaStandalone = window.matchMedia('(display-mode: standalone)');
      matchMediaStandalone.addEventListener('change', (e) => {
        if (e.matches) {
          this.markAsInstalled();
        }
      });
    } catch (e) {}

    // Android / Chrome beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      this.notifyPromptAvailable(true);
    });

    // Native appinstalled event: reliably confirms the user completed installation
    window.addEventListener('appinstalled', () => {
      this.markAsInstalled();
      this.deferredPrompt = null;
      this.notifyPromptAvailable(false);
    });
  }

  /**
   * Evaluates whether the app is currently running as an installed PWA
   * or was previously confirmed as installed on this browser.
   */
  public checkIsInstalled(): boolean {
    if (typeof window === 'undefined') return false;

    // 1. Check persistent localStorage flag (set upon confirmed installation)
    try {
      if (localStorage.getItem('raithu_pwa_installed') === 'true') {
        return true;
      }
    } catch (e) {}

    // 2. Check standard display-mode: standalone
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      this.markAsInstalled();
      return true;
    }

    // 3. Check iOS Safari standalone
    if ((navigator as any).standalone === true) {
      this.markAsInstalled();
      return true;
    }

    // 4. Check Android Trusted Web Activity (TWA) referrer
    if (document.referrer && document.referrer.startsWith('android-app://')) {
      this.markAsInstalled();
      return true;
    }

    return false;
  }

  public isInstalled(): boolean {
    return this.isInstalledState || this.checkIsInstalled();
  }

  public isPromptAvailable(): boolean {
    return this.deferredPrompt !== null;
  }

  public isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  public markAsInstalled(): void {
    this.isInstalledState = true;
    try {
      localStorage.setItem('raithu_pwa_installed', 'true');
    } catch (e) {}
    this.listeners.forEach((cb) => cb(true));
  }

  /**
   * Prompts user to install Raithu Alert.
   * Handles Android native dialog vs iOS Safari instructions.
   */
  public async promptInstall(): Promise<InstallOutcome> {
    // 1. Android Chrome native installation flow
    if (this.deferredPrompt) {
      try {
        const promptEvent = this.deferredPrompt;
        // The prompt can only be called once per event
        this.deferredPrompt = null;
        this.notifyPromptAvailable(false);

        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;

        if (choiceResult && choiceResult.outcome === 'accepted') {
          // User accepted installation
          this.markAsInstalled();
          return 'accepted';
        } else {
          // User cancelled / dismissed the native prompt
          // DO NOT mark as installed!
          return 'dismissed';
        }
      } catch (err) {
        console.warn('Error during beforeinstallprompt prompt():', err);
        return 'unsupported';
      }
    }

    // 2. iOS Safari flow
    if (this.isIOS()) {
      return 'ios_guide';
    }

    return 'unsupported';
  }

  public subscribe(listener: InstallListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.isInstalled());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribePromptAvailable(listener: (available: boolean) => void): () => void {
    this.promptAvailableListeners.add(listener);
    listener(this.deferredPrompt !== null);
    return () => {
      this.promptAvailableListeners.delete(listener);
    };
  }

  private notifyPromptAvailable(available: boolean): void {
    this.promptAvailableListeners.forEach((cb) => cb(available));
  }
}

export const pwaInstallManager = new PwaInstallManager();
