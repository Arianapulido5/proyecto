import type { CapacitorConfig } from '@capacitor/cli';
import { Capacitor } from '@capacitor/core';


if (Capacitor.getPlatform() === 'web') {
  console.log('Estás en una plataforma web');
}

const config: CapacitorConfig = {
  appId: 'com.eCocina.id',
  appName: 'eCocina',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '898105310904-28gnb2p119q7pof1ebuf1dhg0en6db1u.apps.googleusercontent.com', // Tu Client ID
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
