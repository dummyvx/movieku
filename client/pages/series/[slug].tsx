import { FunctionComponent, ReactNode } from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import Head from "next/head";

import { Series } from "../../types";
import { Footer, Header, OneSeriesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";

interface ISeriesPage {
  seri: Series;
}

const SeriesPageWrapper = ({
  seri,
  children,
}: {
  seri: ISeriesPage["seri"];
  children: ReactNode;
}) => (
  <SeriesContextProvider seri={seri}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const MoviePage: FunctionComponent<ISeriesPage> = ({ seri }) => {
  if (!seri) return <></>;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-1 px-4 sm:px-10 md:px-14">
      <Head>
        <title>{seri.title.split("Film ")[1]} - Movies</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SeriesPageWrapper seri={seri}>
        <Header />
        <OneSeriesComponent />
        <Footer />
      </SeriesPageWrapper>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const slug = params?.slug;

  if (!slug)
    return {
      props: {
        seri: null,
      },
    };

  const {
    data: { data: seri },
  } = await axios.get(`${SERVER_URL}/series/${slug}/one`);

  // if no result -> ask user to wait or not -> Wait ->
  // Scrap the data from the original web, and add it to the database

  return {
    props: {
      seri,
    },
  };
};

export default MoviePage;
