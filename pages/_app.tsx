// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import theme from '../styles/theme'
import '../styles/globals.css'
import Layout from '../components/Layout'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default MyApp