import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.modunongbu.app',
  appName: '모두의농부',
  webDir: 'public',
  server: {
    // 임시: 로컬 개발 서버(같은 Wi-Fi에서 접속 가능한 주소). EC2 배포가 끝나면
    // 실제 https 도메인으로 바꾸고 cleartext는 제거하세요.
    url: 'http://192.168.219.113:3000',
    cleartext: true,
  },
};

export default config;
