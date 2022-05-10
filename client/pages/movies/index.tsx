import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Footer, Header, MoviesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import { APIResponse, CommandBoxData, Movie } from "../../types";
import Script from "next/script";
import createStructuredListItem from "../../helpers/createStructuredListItem";

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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Movies Page - Next.js</title>
        <meta name="description" content="See all latest movies" />
        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/movies`} />

        <meta
          property="og:title"
          content="Movies Page - Next.js"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta property="og:description" content="See all latest movies" />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/movies`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Movies Page - Next.js"
          key="twitter:title"
        />
        <meta name="twitter:description" content="See all latest movies" />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="movies-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${movies.data
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

      <MoviesPageWrapper movies={movies}>
        <Header />
        <MoviesComponent />
        <Footer />
      </MoviesPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: movies }: { data: APIResponse<Array<Movie>> } = await axios.get(
    `${SERVER_URL}/movie?limit=32`
  );
  const cleanedData = movies.data.map((item) => ({
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
      movies: {
        data: cleanedData,
        info: movies.info,
      },
    },
  };
}

export default MoviesPage;
