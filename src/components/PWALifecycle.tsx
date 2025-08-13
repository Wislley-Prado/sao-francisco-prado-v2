import React from 'react';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { InstallPrompt } from './InstallPrompt';
import { IOSInstallPrompt } from './IOSInstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';
import { UpdatePrompt } from './UpdatePrompt';

export const PWALifecycle: React.FC = () => {
  const pwaState = usePWALifecycle();
  
  console.log('🔄 PWALifecycle: Component rendered', pwaState);

  return (
    <>
      {/* Show install prompt for Android/Chrome if app is installable and not installed */}
      {pwaState.isInstallable && !pwaState.isInstalled && pwaState.canInstallNatively && (
        <InstallPrompt onInstall={pwaState.installApp} />
      )}
      
      {/* Show iOS manual install instructions */}
      {pwaState.isIOS && !pwaState.isInstalled && (
        <IOSInstallPrompt onDismiss={() => {}} />
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