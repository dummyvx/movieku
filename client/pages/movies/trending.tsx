import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, TrendingsComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import { APIResponse, Movie } from "../../types";
import Script from "next/script";
import createStructuredListItem from "../../helpers/createStructuredListItem";

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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Popular Movies - Next.js</title>
        <meta
          name="description"
          content="See all popular movies of all time."
        />
        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/movies/trending`} />

        <meta
          property="og:title"
          content="Popular Movies - Next.js"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:description"
          content="See all popular movies of all time."
        />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/movies/trending`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Popular Movies - Next.js"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="See all popular movies of all time."
        />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="trendingMovies-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${trendingMovies.data
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
  const cleanedData = trendingMovies.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    poster: item.poster,
    rating: item.rating,
    duration: item.duration,
    director: item.director,
    release: item.release,
  }));

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
