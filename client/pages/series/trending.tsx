import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, SeriesTrending } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";
import { APIResponse, CommandBoxData, Series } from "../../types";

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
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Trending Series - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
      duration: series.duration,
      poster: series.poster,
      rating: series.rating,
      slug: series.slug,
      title: series.title,
      status: series.status,
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
