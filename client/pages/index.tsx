import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";

import { Header, TrendingMovies, TrendingSeries } from "../components";
import { APIResponse, Movie, Series } from "../types";
import MovieContextProvider from "../contexts/MovieContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { ReactNode } from "react";
import Footer from "../components/Footer";

interface IHome {
  trendingMovies: APIResponse<Array<Movie>>;
  trendingSeries: APIResponse<Array<Series>>;
}

const HomeWrapper = ({
  trendingMovies,
  trendingSeries,
  children,
}: IHome & { children: ReactNode }) => (
  <MovieContextProvider trendingMovies={trendingMovies}>
    <SeriesContextProvider trendingSeries={trendingSeries}>
      <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
    </SeriesContextProvider>
  </MovieContextProvider>
);

const Home: NextPage<IHome> = (props) => {
  const { trendingMovies, trendingSeries } = props;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Popular Movies and Series - Movieku</title>
        <meta
          name="description"
          content="See popular movies and series around the world!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeWrapper
        trendingMovies={trendingMovies}
        trendingSeries={trendingSeries}
      >
        <Header />
        <TrendingMovies />
        <TrendingSeries />
        <Footer />
      </HomeWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: trendingMovies }: { data: APIResponse<Array<Movie>> } =
    await axios.get(`${SERVER_URL}/movie?limit=14&based=trending`);

  const { data: trendingSeries }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=14&based=trending`);

  const cleanedTrendingMovies = trendingMovies.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
  }));

  const cleanedTrendingSeries = trendingSeries.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
    status: item.status,
  }));

  return {
    props: {
      trendingMovies: {
        info: trendingMovies.info,
        data: cleanedTrendingMovies,
      },
      trendingSeries: {
        info: trendingSeries.info,
        data: cleanedTrendingSeries,
      },
    },
  };
}

export default Home;
