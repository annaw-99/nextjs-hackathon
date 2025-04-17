import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>HUEY - Get in Line</title>
        <meta name="description" content="Join the waitlist at your favorite restaurants from your phone" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
