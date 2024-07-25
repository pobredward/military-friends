interface KakaoAuthLoginOptions {
  success: (authObj: any) => void;
  fail: (error: any) => void;
}

interface KakaoAuth {
  login(options: KakaoAuthLoginOptions): void;
}

interface KakaoAPI {
  request(options: {
    url: string;
    success: (response: any) => void;
    fail: (error: any) => void;
  }): void;
}

interface KakaoSDK {
  init(appKey: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
  API: KakaoAPI;
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}
