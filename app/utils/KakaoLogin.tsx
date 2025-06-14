// kakaoLogin.ts
import * as WebBrowser from 'expo-web-browser';

const kakaoClientId = 'eac16354182267754c7d163e1773f683';
const redirectUri = 'https://kakao-redirect-amber.vercel.app'; // Vercel에 배포한 리디렉션 페이지 주소

export const loginWithKakao = async () => {
  const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${redirectUri}`;
  await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
};
