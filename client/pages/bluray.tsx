import type { NextPage } from "next";
import axios from "axios";
import Head from "next/head";

import { Header, BlurayComponent } from "../components";
import { APIResponse, Movie } from "../types";
import MovieContextProvider from "../contexts/MovieContext";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { ReactNode } from "react";
import Footer from "../components/Footer";
import Script from "next/script";
import createStructuredListItem from "../helpers/createStructuredListItem";

interface IBluray {
  blurayMovies: APIResponse<Array<Movie>>;
}

const HomeWrapper = ({
  blurayMovies,
  children,
}: Omit<IBluray, "baseURL"> & { children: ReactNode }) => (
  <MovieContextProvider blurayMovies={blurayMovies}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </MovieContextProvider>
);

const Home: NextPage<IBluray> = (props) => {
  const { blurayMovies } = props;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Bluray Movies - Movieku</title>
        <meta name="description" content="See and download Blu-Ray movies" />
        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/bluray`} />

        <meta
          property="og:title"
          content="Bluray Movies - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:description"
          content="See and download Blu-Ray movies"
        />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/bluray`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Bluray Movies - Movieku"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="See and download Blu-Ray movies"
        />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="bluray-structured-data" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${blurayMovies.data
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
    director: item.director,
    release: item.release,
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
