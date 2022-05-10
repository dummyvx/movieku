import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, CompletedComponent, Footer } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import { APIResponse, CommandBoxData, Series } from "../types";
import Script from "next/script";
import createStructuredListItem from "../helpers/createStructuredListItem";

interface ICompletePage {
  complete: APIResponse<Array<Series>>;
  baseURL: string;
}

const CompletePageWrapper = ({
  complete,
  children,
}: {
  complete: APIResponse<Series[]>;
  children: ReactNode;
}) => (
  <SeriesContextProvider completed={complete}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const CompletePage: NextPage<ICompletePage> = ({ complete, baseURL }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Completed Series - Movieku</title>
        <meta name="description" content="See and download Completed Series!" />

        <meta name="image" content={`${baseURL}/vercel.svg`} />
        <meta name="url" content={`${baseURL}/complete`} />

        <meta
          property="og:title"
          content="Bluray Movies - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="See and download Blu-Ray movies"
        />
        <meta property="og:image" content={`${baseURL}/vercel.svg`} />
        <meta property="og:url" content={`${baseURL}/complete`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Bluray Movies - Movieku"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="See and download Blu-Ray movies"
        />
        <meta name="twitter:image" content={`${baseURL}/vercel.svg`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="complete-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${complete.data
                .map((value, index) =>
                  createStructuredListItem({
                    director: value.director ?? "",
                    image: value.poster,
                    index,
                    name: value.title,
                    rating: value.rating,
                    release: value.release ?? "",
                    slug: value.slug,
                    status: value.status,
                  })
                )
                .join(",")}
            ]
          }`}
      </Script>

      <CompletePageWrapper complete={complete}>
        <Header />
        <CompletedComponent />
        <Footer />
      </CompletePageWrapper>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const {
    req: {
      headers: { host },
    },
  } = context;

  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: complete }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=32&status=Completed`);

  const cleanedData: Array<CommandBoxData> = complete.data.map((series) => ({
    title: series.title,
    slug: series.slug,
    poster: series.poster,
    rating: series.rating,
    duration: series.duration,
    status: series.status,
    director: series.director,
    release: series.release,
  }));

  return {
    props: {
      complete: {
        data: cleanedData,
        info: complete.info,
      },
      baseURL: host,
    },
  };
}

export default CompletePage;
