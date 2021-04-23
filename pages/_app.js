import { createGlobalStyle, ThemeProvider } from "styled-components";
import GlobalStyles from "../utils/GlobalStyles";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
