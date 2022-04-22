import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Footer, Header, SeriesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";
import { APIResponse, CommandBoxData, Series } from "../../types";

interface ISeriesPage {
  series: APIResponse<Array<Series>>;
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
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Series Page - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
    duration: series.duration,
    poster: series.poster,
    rating: series.rating,
    slug: series.slug,
    title: series.title,
    status: series.status,
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
