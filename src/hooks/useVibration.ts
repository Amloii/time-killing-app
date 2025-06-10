import { useCallback } from 'react';

export const useVibration = () => {
  const isSupported = 'vibrate' in navigator;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!isSupported) return false;
    
    try {
      return navigator.vibrate(pattern);
    } catch (error) {
      console.error('Vibration error:', error);
      return false;
    }
  }, [isSupported]);

  const vibrateSuccess = useCallback(() => {
    return vibrate([100, 50, 100]);
  }, [vibrate]);

  const vibrateError = useCallback(() => {
    return vibrate([200, 100, 200, 100, 200]);
  }, [vibrate]);

  const vibrateNotification = useCallback(() => {
    return vibrate([50, 50, 50]);
  }, [vibrate]);

  const vibrateBattleStart = useCallback(() => {
    return vibrate([300, 100, 300]);
  }, [vibrate]);

  return {
    isSupported,
    vibrate,
    vibrateSuccess,
    vibrateError,
    vibrateNotification,
    vibrateBattleStart
  };
};