// PWA utility functions

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  // Check if we're in a supported environment
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported in this browser');
    return null;
  }

  // Check if we're in StackBlitz or other unsupported environments
  if (window.location.hostname === 'localhost' && window.location.port === '5173') {
    console.log('Service Worker registration skipped in development environment');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.log('Service Worker registration failed (this is expected in some environments):', error);
    return null;
  }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const result = await registration.unregister();
        console.log('Service Worker unregistered:', result);
        return result;
      }
    } catch (error) {
      console.log('Service Worker unregistration failed:', error);
    }
  }
  return false;
};

export const checkForUpdates = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }
  return false;
};

export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

export const getInstallPrompt = (): Promise<any> => {
  return new Promise((resolve) => {
    const handler = (e: Event) => {
      e.preventDefault();
      window.removeEventListener('beforeinstallprompt', handler);
      resolve(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
  });
};

export const shareContent = async (data: ShareData): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.log('Share failed:', error);
    }
  }
  return false;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.log('Clipboard write failed:', error);
    }
  }
  
  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (error) {
    console.log('Fallback copy failed:', error);
    return false;
  }
};

export const requestWakeLock = async (): Promise<WakeLockSentinel | null> => {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      console.log('Wake lock acquired');
      return wakeLock;
    } catch (error) {
      console.log('Wake lock request failed:', error);
    }
  }
  return null;
};

export const releaseWakeLock = async (wakeLock: WakeLockSentinel): Promise<void> => {
  try {
    await wakeLock.release();
    console.log('Wake lock released');
  } catch (error) {
    console.log('Wake lock release failed:', error);
  }
};