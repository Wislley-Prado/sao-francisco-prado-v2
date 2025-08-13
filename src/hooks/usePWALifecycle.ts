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
  hasUpdate: boolean;
  isUpdateReady: boolean;
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
    hasUpdate: false,
    isUpdateReady: false,
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

    // Listen for service worker updates
    const handleSWUpdate = () => {
      console.log('🔄 PWA: Service Worker update available');
      setState(prev => ({ ...prev, hasUpdate: true }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker registration and update detection
    if ('serviceWorker' in navigator) {
      console.log('⚙️ PWA: Service Worker supported');
      navigator.serviceWorker.addEventListener('controllerchange', handleSWUpdate);
      
      // Check registration status
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          console.log('✅ PWA: Service Worker registered', registration);
        } else {
          console.log('❌ PWA: Service Worker not registered');
        }
      });
      
      // Check for updates periodically
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.update();
          }
        });
      }, 60000); // Check every minute
    } else {
      console.log('❌ PWA: Service Worker not supported');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleSWUpdate);
      }
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

  const reloadApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return {
    ...state,
    installApp,
    reloadApp,
    canInstall: !!deferredPrompt,
  };
};