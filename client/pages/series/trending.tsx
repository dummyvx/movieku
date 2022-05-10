import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, SeriesTrending } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";
import { APIResponse, CommandBoxData, Series } from "../../types";
import Script from "next/script";
import createStructuredListItem from "../../helpers/createStructuredListItem";

interface ITrendingSeriesPage {
  trendingSeries: APIResponse<Array<Series>>;
}

const SeriesPageWrapper = ({
  trendingSeries,
  children,
}: {
  trendingSeries: APIResponse<Series[]>;
  children: ReactNode;
}) => (
  <SeriesContextProvider trendingSeries={trendingSeries}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const SeriesPage: NextPage<ITrendingSeriesPage> = ({ trendingSeries }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Trending Series - Movieku</title>
        <meta
          name="description"
          content="See all trending series of all time."
        />
        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/series`} />

        <meta
          property="og:title"
          content="Trending Series - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:description"
          content="See all trending series of all time."
        />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/series`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Trending Series - Movieku"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="See all trending series of all time."
        />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="trendignSeries-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${trendingSeries.data
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

      <SeriesPageWrapper trendingSeries={trendingSeries}>
        <Header />
        <SeriesTrending />
      </SeriesPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: trendingSeries }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=32&based=trending`);
  const cleanedData: Array<CommandBoxData> = trendingSeries.data.map(
    (series) => ({
      title: series.title,
      slug: series.slug,
      poster: series.poster,
      rating: series.rating,
      duration: series.duration,
      status: series.status,
      director: series.director,
      release: series.release,
    })
  );
  return {
    props: {
      trendingSeries: {
        data: cleanedData,
        info: trendingSeries.info,
      },
    },
  };
}

export default SeriesPage;
