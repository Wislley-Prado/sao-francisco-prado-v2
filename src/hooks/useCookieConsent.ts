import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  personalization: false,
};

const STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0';

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.version === CONSENT_VERSION) {
          setPreferences(data.preferences);
          setHasConsented(true);
          setShowBanner(false);
        } else {
          // Version mismatch, show banner again
          setShowBanner(true);
        }
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    savePreferences(allAccepted);
  };

  const rejectOptional = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    const data = {
      preferences: newPreferences,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPreferences(newPreferences);
    setHasConsented(true);
    setShowBanner(false);
  };

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    savePreferences(updated);
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPreferences(DEFAULT_PREFERENCES);
    setHasConsented(false);
    setShowBanner(true);
  };

  return {
    showBanner,
    preferences,
    hasConsented,
    acceptAll,
    rejectOptional,
    savePreferences,
    updatePreferences,
    resetConsent,
    setShowBanner,
  };
};