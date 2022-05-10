import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Footer, Header, OngoingComponent } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import { APIResponse, CommandBoxData, Series } from "../types";
import Script from "next/script";
import createStructuredListItem from "../helpers/createStructuredListItem";

interface IOngoingPage {
  ongoing: APIResponse<Array<Series>>;
}

const OngoingPageWrapper = ({
  ongoing,
  children,
}: {
  ongoing: APIResponse<Series[]>;
  children: ReactNode;
}) => (
  <SeriesContextProvider ongoing={ongoing}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const CompletePage: NextPage<IOngoingPage> = ({ ongoing }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Ongoing Series - Movieku</title>
        <meta name="description" content="See all ongoing series." />
        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/ongoing`} />

        <meta
          property="og:title"
          content="Ongoing Series - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta property="og:description" content="See all ongoing series." />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/ongoing`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Ongoing Series - Movieku"
          key="twitter:title"
        />
        <meta name="twitter:description" content="See all ongoing series." />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="ongoing-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${ongoing.data
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

      <OngoingPageWrapper ongoing={ongoing}>
        <Header />
        <OngoingComponent />
        <Footer />
      </OngoingPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: ongoing }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=32&status=Ongoing`);

  const cleanedData: Array<CommandBoxData> = ongoing.data.map((series) => ({
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
      ongoing: {
        data: cleanedData,
        info: ongoing.info,
      },
    },
  };
}

export default CompletePage;
