import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, SeriesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";
import { APIResponse, Series } from "../../types";

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
      </SeriesPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: series } = await axios.get(`${SERVER_URL}/series?limit=32`);

  return {
    props: {
      series,
    },
  };
}

export default SeriesPage;
