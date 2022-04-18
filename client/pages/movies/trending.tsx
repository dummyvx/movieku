import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, TrendingsComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import { APIResponse, CommandBoxData, Movie } from "../../types";

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

  const { data: trendingMovies }: { data: APIResponse<Array<Movie>> } =
    await axios.get(`${SERVER_URL}/movie?limit=32&based=trending`);
  const cleanedData: Array<CommandBoxData> = trendingMovies.data.map(
    (movies) => ({
      duration: movies.duration,
      poster: movies.poster,
      rating: movies.rating,
      slug: movies.slug,
      title: movies.title,
    })
  );

  return {
    props: {
      trendingMovies: {
        data: cleanedData,
        info: trendingMovies.info,
      },
    },
  };
}

export default MoviesPage;
