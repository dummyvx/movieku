import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";

import {
  Header,
  NewestMovies,
  NewestSeries,
  TrendingMovies,
  TrendingSeries,
} from "../components";
import { APIResponse, Movie, Series } from "../types";
import MovieContextProvider from "../contexts/MovieContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { ReactNode } from "react";
import Footer from "../components/Footer";

interface IHome {
  newestMovies: APIResponse<Array<Movie>>;
  newestSeries: APIResponse<Array<Series>>;
  trendingMovies: APIResponse<Array<Movie>>;
  trendingSeries: APIResponse<Array<Series>>;
}

const HomeWrapper = ({
  newestMovies,
  newestSeries,
  trendingMovies,
  trendingSeries,
  children,
}: IHome & { children: ReactNode }) => (
  <MovieContextProvider
    movieResponse={newestMovies}
    trendingMovies={trendingMovies}
  >
    <SeriesContextProvider
      seriesResponse={newestSeries}
      trendingSeries={trendingSeries}
    >
      <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
    </SeriesContextProvider>
  </MovieContextProvider>
);

const Home: NextPage<IHome> = (props) => {
  const { newestMovies, trendingMovies, newestSeries, trendingSeries } = props;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Movieku - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeWrapper
        newestSeries={newestSeries}
        newestMovies={newestMovies}
        trendingMovies={trendingMovies}
        trendingSeries={trendingSeries}
      >
        <Header />
        <TrendingMovies />
        <TrendingSeries />
        <NewestMovies />
        <NewestSeries />
        <Footer />
      </HomeWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: trendingMovies }: { data: APIResponse<Array<Movie>> } =
    await axios.get(`${SERVER_URL}/movie?limit=8&based=trending`);

  const { data: newestMovies }: { data: APIResponse<Array<Movie>> } =
    await axios.get(`${SERVER_URL}/movie?limit=16`);

  const { data: newestSeries }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=16`);

  const { data: trendingSeries }: { data: APIResponse<Array<Series>> } =
    await axios.get(`${SERVER_URL}/series?limit=8&based=trending`);

  const cleanedTrendingMovies = trendingMovies.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
  }));

  const cleanedNewestMovies = newestMovies.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
  }));

  const cleanedNewestSeries = newestSeries.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
    status: item.status,
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
      newestMovies: {
        info: newestMovies.info,
        data: cleanedNewestMovies,
      },
      newestSeries: {
        info: newestSeries.info,
        data: cleanedNewestSeries,
      },
      trendingSeries: {
        info: trendingSeries.info,
        data: cleanedTrendingSeries,
      },
    },
  };
}

export default Home;
