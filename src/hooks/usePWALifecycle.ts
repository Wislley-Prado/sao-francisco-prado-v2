import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWALifecycleState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  canInstallNatively: boolean;
}

const detectPlatform = () => {
  console.log('🔍 Detecting platform...');
  const userAgent = navigator.userAgent || navigator.vendor;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/i.test(userAgent);
  
  return { isIOS, isAndroid };
};

export const usePWALifecycle = () => {
  const { isIOS, isAndroid } = detectPlatform();
  
  const [state, setState] = useState<PWALifecycleState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isIOS,
    isAndroid,
    canInstallNatively: !isIOS, // iOS doesn't support native install prompt
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    console.log('🔧 PWA Lifecycle: Initializing...');
    console.log('📱 Platform Detection:', { isIOS, isAndroid });
    console.log('🌐 Navigator Info:', { 
      userAgent: navigator.userAgent, 
      onLine: navigator.onLine,
      serviceWorker: 'serviceWorker' in navigator 
    });
    
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    
    console.log('📦 Installation Status:', { isInstalled });
    setState(prev => ({ ...prev, isInstalled }));

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA: beforeinstallprompt event fired', e);
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('✅ PWA: App installed successfully');
      setDeferredPrompt(null);
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
    };

    // Listen for online/offline
    const handleOnline = () => {
      console.log('🌐 PWA: Online');
      setState(prev => ({ ...prev, isOnline: true }));
    };
    const handleOffline = () => {
      console.log('📴 PWA: Offline');
      setState(prev => ({ ...prev, isOnline: false }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    console.log('📱 PWA: Install attempt', { isIOS, deferredPrompt: !!deferredPrompt });
    
    if (isIOS) {
      console.log('🍎 PWA: iOS detected - manual installation required');
      return false; // iOS requires manual installation
    }
    
    if (!deferredPrompt) {
      console.log('❌ PWA: No deferred prompt available');
      return false;
    }

    try {
      console.log('🚀 PWA: Showing install prompt');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('🎯 PWA: User choice:', outcome);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setState(prev => ({ 
          ...prev, 
          isInstallable: false,
          isInstalled: true 
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ PWA: Error installing app:', error);
      return false;
    }
  };

  return {
    ...state,
    installApp,
    canInstall: !!deferredPrompt,
  };
};