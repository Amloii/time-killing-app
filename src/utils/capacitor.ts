import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

export class CapacitorService {
  static isNative = Capacitor.isNativePlatform();
  static platform = Capacitor.getPlatform();

  // Initialize app
  static async initialize() {
    if (!this.isNative) return;

    try {
      // Hide splash screen after app loads
      await SplashScreen.hide();

      // Set status bar style
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ef4444' });

      // Listen for app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      // Handle back button on Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      // Get device info
      const deviceInfo = await Device.getInfo();
      console.log('Device info:', deviceInfo);

    } catch (error) {
      console.error('Error initializing Capacitor:', error);
    }
  }

  // Haptic feedback
  static async hapticFeedback(style: ImpactStyle = ImpactStyle.Medium) {
    if (!this.isNative) return;
    
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  }

  // Keyboard utilities
  static async hideKeyboard() {
    if (!this.isNative) return;
    
    try {
      await Keyboard.hide();
    } catch (error) {
      console.error('Hide keyboard error:', error);
    }
  }

  // Storage utilities (replaces localStorage for better mobile performance)
  static async setItem(key: string, value: string) {
    if (this.isNative) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    if (this.isNative) {
      const result = await Preferences.get({ key });
      return result.value;
    } else {
      return localStorage.getItem(key);
    }
  }

  static async removeItem(key: string) {
    if (this.isNative) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }

  static async clear() {
    if (this.isNative) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  }
}