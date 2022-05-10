import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";

import { Header, TrendingMovies, TrendingSeries } from "../components";
import { APIResponse, Movie, Series } from "../types";
import MovieContextProvider from "../contexts/MovieContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Script from "next/script";
import createStructuredListItem from "../helpers/createStructuredListItem";

interface IHome {
  trendingMovies: APIResponse<Array<Movie>>;
  trendingSeries: APIResponse<Array<Series>>;
  baseURL: string;
}

const HomeWrapper = ({
  trendingMovies,
  trendingSeries,
  children,
}: Omit<IHome, "baseURL"> & { children: ReactNode }) => (
  <MovieContextProvider trendingMovies={trendingMovies}>
    <SeriesContextProvider trendingSeries={trendingSeries}>
      <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
    </SeriesContextProvider>
  </MovieContextProvider>
);

const Home: NextPage<IHome> = (props) => {
  const { trendingMovies, trendingSeries, baseURL } = props;
  const structuredDatas = [...trendingMovies.data, ...trendingSeries.data];

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Popular Movies and Series - Movieku</title>
        <meta
          name="description"
          content="See popular movies and series around the world!"
        />
        <meta name="image" content={`${baseURL}/vercel.svg`} />
        <meta name="url" content={baseURL} />

        <meta
          property="og:title"
          content="Popular Movies and Series - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="See popular movies and series around the world!"
        />
        <meta property="og:image" content={`${baseURL}/vercel.svg`} />
        <meta property="og:url" content={baseURL} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Popular Movies and Series - Movieku"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="See popular movies and series around the world!"
        />
        <meta name="twitter:image" content={`${baseURL}/vercel.svg`} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="index-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${structuredDatas
                .map((value, index) =>
                  createStructuredListItem({
                    director: value.director ?? "",
                    image: value.poster,
                    index,
                    name: value.title,
                    rating: value.rating,
                    release: value.release ?? "",
                    slug: value.slug,
                    status: value.status,
                  })
                )
                .join(",")}
            ]
          }`}
      </Script>

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    req: { headers },
  } = context;

  const host = headers.host;

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
    director: item.director,
    release: item.release,
  }));

  const cleanedTrendingSeries = trendingSeries.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
    status: item.status,
    director: item.director,
    release: item.release,
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
      baseURL: host,
    },
  };
};

export default Home;
