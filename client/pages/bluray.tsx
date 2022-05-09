import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";

import { Header, BlurayComponent } from "../components";
import { APIResponse, Movie } from "../types";
import MovieContextProvider from "../contexts/MovieContext";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { ReactNode } from "react";
import Footer from "../components/Footer";

interface IBluray {
  blurayMovies: APIResponse<Array<Movie>>;
}

const HomeWrapper = ({
  blurayMovies,
  children,
}: IBluray & { children: ReactNode }) => (
  <MovieContextProvider blurayMovies={blurayMovies}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </MovieContextProvider>
);

const Home: NextPage<IBluray> = (props) => {
  const { blurayMovies } = props;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Bluray Movies - Movieku</title>
        <meta name="description" content="See and download Blu-Ray movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeWrapper blurayMovies={blurayMovies}>
        <Header />
        <BlurayComponent />
        <Footer />
      </HomeWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: blurayMovies }: { data: APIResponse<Array<Movie>> } =
    await axios.get(`${SERVER_URL}/movie?limit=32&quality=Bluray`);

  const cleanedBlurayMovies = blurayMovies.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
  }));

  return {
    props: {
      blurayMovies: {
        info: blurayMovies.info,
        data: cleanedBlurayMovies,
      },
    },
  };
}

export default Home;
