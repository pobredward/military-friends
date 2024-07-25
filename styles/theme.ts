import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      greenPrimary: string;
      greenSecondary: string;
      background: string;
    };
    fonts: {
      main: string;
    };
  }
}

const theme = {
  colors: {
    greenPrimary: '#18B018',
    greenSecondary: '#1B271D',
    background: '#1D1A1A',
  },
  fonts: {
    main: 'Noto Sans KR, sans-serif',
  },
}

export default theme