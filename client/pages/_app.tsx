import "../styles/globals.css";

import type { AppProps } from "next/app";
import { Fragment, useState } from "react";
import { Router } from "next/router";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  Router.events.on("routeChangeStart", () => setIsRouteLoading(true));
  Router.events.on("routeChangeComplete", () => setIsRouteLoading(false));

  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>

      {isRouteLoading && (
        <div className="h-[2px] animate-pulse bg-gradient-to-r from-red-500 to-slate-500 via-indigo-400 z-50 sticky top-0 left-0 w-full">
          Hello
        </div>
      )}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
