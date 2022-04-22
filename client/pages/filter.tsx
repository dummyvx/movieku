import { ReactNode } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { Header, QueryFilter } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import Footer from "../components/Footer";
import { getNextMovies } from "../api/movies.api";
import { getNextSeries } from "../api/series.api";
import { APIResponse, CommandBoxData, Movie, Series } from "../types";
import { InfoType } from "../components/QueryFilter";

const HomeWrapper = ({ children }: { children: ReactNode }) => (
  <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
);

interface IFilterPage {
  data: Array<Movie & Series>;
  info: InfoType;
}

const FilterPage: NextPage<IFilterPage> = ({ data: raw, info }) => {
  const data: Array<CommandBoxData> = raw.map((item) => ({
    duration: item.duration,
    poster: item.poster,
    rating: item.rating,
    slug: item.slug,
    title: item.title,
    status: item.status,
  }));

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Filter Page - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeWrapper>
        <Header />
        <QueryFilter data={data} info={info} />
        <Footer />
      </HomeWrapper>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.resolvedUrl.split("?")[1] ?? "";

  let movies: APIResponse<Movie[]> | null = null;
  let series: APIResponse<Series[]> | null = null;

  if (query?.includes("seriesOnly")) {
    series = await getNextSeries(`/v1/series?limit=32&${query}`);
  } else if (query?.includes("movieOnly")) {
    movies = await getNextMovies(`/v1/movie?limit=32&${query}`);
  } else {
    movies = await getNextMovies(`/v1/movie?limit=16&${query}`);
    series = await getNextSeries(`/v1/series?limit=16&${query}`);
  }

  return {
    props: {
      data: [...(movies?.data ?? []), ...(series?.data ?? [])],
      info: {
        movies: movies?.info ?? null,
        series: series?.info ?? null,
      },
    },
  };
};

export default FilterPage;
