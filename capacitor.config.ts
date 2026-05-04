import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sovereigntrust.app',
  appName: 'Sovereign Trust Bank',
  webDir: 'public',
  server: {
    url: 'https://www.sovereigntrust.pro',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0a0a0f'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0a0a0f'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0f',
      showSpinner: false
    }
  }
};

export default config;