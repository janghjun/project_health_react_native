import * as Linking from 'expo-linking';

const GOOGLE_CLIENT_ID = "828973426426-0rhe072vb08qnet1ojc1qaso8sbg592d.apps.googleusercontent.com";
const REDIRECT_URI = "https://google-redirect.vercel.app";

export const loginWithGoogle = () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  Linking.openURL(authUrl);
};
