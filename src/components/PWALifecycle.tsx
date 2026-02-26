import React from 'react';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { OfflineIndicator } from './OfflineIndicator';

export const PWALifecycle: React.FC = () => {
  const pwaState = usePWALifecycle();

  return (
    <>
      <OfflineIndicator isOnline={pwaState.isOnline} />
    </>
  );
};
