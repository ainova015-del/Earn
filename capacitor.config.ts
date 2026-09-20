import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.earnx.rewards',
  appName: 'EarnX',
  webDir: '.',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
