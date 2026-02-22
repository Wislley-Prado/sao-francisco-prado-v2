import React from 'react';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { InstallPrompt } from './InstallPrompt';
import { IOSInstallPrompt } from './IOSInstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';

export const PWALifecycle: React.FC = () => {
  const pwaState = usePWALifecycle();

  return (
    <>
      {pwaState.isInstallable && !pwaState.isInstalled && pwaState.canInstallNatively && (
        <InstallPrompt onInstall={pwaState.installApp} />
      )}
      
      {pwaState.isIOS && !pwaState.isInstalled && (
        <IOSInstallPrompt onDismiss={() => {}} />
      )}
      
      <OfflineIndicator isOnline={pwaState.isOnline} />
    </>
  );
};