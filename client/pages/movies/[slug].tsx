import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FunctionComponent, ReactNode } from "react";
import { Header, MovieComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import { Movie } from "../../types";

interface IMoviePage {
  movie: Movie;
}

const MoviesPageWrapper = ({
  movie,
  children,
}: {
  movie: IMoviePage["movie"];
  children: ReactNode;
}) => (
  <MovieContextProvider movie={movie}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </MovieContextProvider>
);

const MoviePage: FunctionComponent<IMoviePage> = ({ movie }) => {
  if (!movie) return <></>;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-1 px-4 sm:px-10 md:px-14">
      <Head>
        <title>{movie.title.split("Film ")[1]} - Movies</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MoviesPageWrapper movie={movie}>
        <Header />
        <MovieComponent />
      </MoviesPageWrapper>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const slug = params?.slug;

  if (!slug)
    return {
      props: {
        movie: null,
      },
    };

  const {
    data: { data: movie },
  } = await axios.get(`${SERVER_URL}/movie/${slug}/one`);

  // if no result -> ask user to wait or not -> Wait ->
  // Scrap the data from the original web, and add it to the database

  return {
    props: {
      movie,
    },
  };
};

export default MoviePage;
