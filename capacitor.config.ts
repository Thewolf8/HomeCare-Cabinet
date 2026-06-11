import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mywardrobe.app',
  appName: 'MyWardrobe',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#5c5470',
      sound: 'beep.wav',
    },
    Camera: {
      allowEditing: false,
      quality: 80,
      resultType: 'dataUrl',
    },
  },
};

export default config;
