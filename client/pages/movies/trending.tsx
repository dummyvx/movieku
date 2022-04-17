import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, TrendingsComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import { APIResponse, Movie } from "../../types";

interface ITrendingPage {
  trendingMovies: APIResponse<Array<Movie>>;
}

const TrendingPageWrapper = ({
  trendingMovies,
  children,
}: {
  trendingMovies: APIResponse<Movie[]>;
  children: ReactNode;
}) => (
  <MovieContextProvider trendingMovies={trendingMovies}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </MovieContextProvider>
);

const MoviesPage: NextPage<ITrendingPage> = ({ trendingMovies }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Popular Movies - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TrendingPageWrapper trendingMovies={trendingMovies}>
        <Header />
        <TrendingsComponent />
      </TrendingPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: trendingMovies } = await axios.get(
    `${SERVER_URL}/movie?limit=32&based=trending`
  );

  return {
    props: {
      trendingMovies,
    },
  };
}

export default MoviesPage;
