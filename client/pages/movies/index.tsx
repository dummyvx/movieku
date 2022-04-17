import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, MoviesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import { APIResponse, Movie } from "../../types";

interface IMoviesPage {
  movies: APIResponse<Array<Movie>>;
}

const MoviesPageWrapper = ({
  movies,
  children,
}: {
  movies: APIResponse<Movie[]>;
  children: ReactNode;
}) => (
  <MovieContextProvider movieResponse={movies}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </MovieContextProvider>
);

const MoviesPage: NextPage<IMoviesPage> = ({ movies }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Movies Page - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MoviesPageWrapper movies={movies}>
        <Header />
        <MoviesComponent />
      </MoviesPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: movies } = await axios.get(`${SERVER_URL}/movie?limit=32`);

  return {
    props: {
      movies,
    },
  };
}

export default MoviesPage;
