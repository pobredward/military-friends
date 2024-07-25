/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  env: {
    NEXT_PUBLIC_KAKAO_REST_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_KEY,
    NEXT_PUBLIC_KAKAO_JS_KEY: process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
    NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI:
      process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI,

    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  },
};

module.exports = nextConfig;
