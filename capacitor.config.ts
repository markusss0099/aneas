
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a5eb554cce6846cea7ea6a53624188cd',
  appName: 'Cashflow Manager',
  webDir: 'dist',
  server: {
    url: 'https://a5eb554c-ce68-46ce-a7ea-6a53624188cd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
