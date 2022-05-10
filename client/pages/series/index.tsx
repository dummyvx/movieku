import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Footer, Header, SeriesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";
import { APIResponse, CommandBoxData, Series } from "../../types";
import Script from "next/script";
import createStructuredListItem from "../../helpers/createStructuredListItem";

interface ISeriesPage {
  series: APIResponse<Array<Series>>;
  baseURL: string;
}

const SeriesPageWrapper = ({
  series,
  children,
}: {
  series: APIResponse<Series[]>;
  children: ReactNode;
}) => (
  <SeriesContextProvider seriesResponse={series}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const SeriesPage: NextPage<ISeriesPage> = ({ series }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Series Page - Movieku</title>
        <meta name="description" content="See all latest series of all time." />
        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/series`} />

        <meta
          property="og:title"
          content="Series Page - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:description"
          content="See all latest series of all time."
        />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/series`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Series Page - Movieku"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="See all latest series of all time."
        />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="series-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${series.data
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

      <SeriesPageWrapper series={series}>
        <Header />
        <SeriesComponent />
        <Footer />
      </SeriesPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: series }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=32`);
  const cleanedData: Array<CommandBoxData> = series.data.map((series) => ({
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
      series: {
        data: cleanedData,
        info: series.info,
      },
    },
  };
}

export default SeriesPage;
