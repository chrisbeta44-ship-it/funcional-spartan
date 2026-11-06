import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.funcionalspartan.app',
  appName: 'Funcional Spartan',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#080808',
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
