import React from 'react';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { InstallPrompt } from './InstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';
import { UpdatePrompt } from './UpdatePrompt';

export const PWALifecycle: React.FC = () => {
  const pwaState = usePWALifecycle();

  return (
    <>
      {/* Show install prompt if app is installable and not installed */}
      {pwaState.isInstallable && !pwaState.isInstalled && (
        <InstallPrompt onInstall={pwaState.installApp} />
      )}
      
      {/* Show offline indicator */}
      <OfflineIndicator isOnline={pwaState.isOnline} />
      
      {/* Show update prompt if update is available */}
      {pwaState.hasUpdate && (
        <UpdatePrompt onUpdate={pwaState.reloadApp} />
      )}
    </>
  );
};