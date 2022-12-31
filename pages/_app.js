// pages/_app.js
import Head from 'next/head'
import Script from 'next/script'
import './css/card.css'
import './css/grid.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Emoji Cat 😽</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="google-site-verification" content="Fj72TTEG80mXVgHNIA4fKeb3hy4Oa-20LvlcvTncKFI" />
        <script async="async" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4352778397803727" crossorigin="anonymous"></script>
      </Head>
      {/* <Script
        id="Adsense-id"
        async strategy="beforeInteractive"
        onError={ (e) => { console.error('Script failed to load', e) }}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4352778397803727"
        crossorigin="anonymous"
      /> */}
      <Component {...pageProps} />
    </>
  )
};