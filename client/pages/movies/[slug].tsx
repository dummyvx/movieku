import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Script from "next/script";
import { FunctionComponent, ReactNode } from "react";
import { Footer, Header, MovieComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import MovieContextProvider from "../../contexts/MovieContext";
import createStructuredActorData from "../../helpers/createStructuredActorData";
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

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-1 px-4 sm:px-10 md:px-14">
      <Head>
        <title>{movie.title.split("Film ")[1]} - Movieku</title>
        <meta name="description" content={movie.synopsis} />
        <meta name="image" content={movie.poster} />
        <meta name="url" content={`${BASE_URL}/movies/${movie.slug}`} />

        <meta
          property="og:title"
          content={`${movie.title.split("Film ")[1]} - Movieku`}
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta property="og:description" content={movie.synopsis} />
        <meta property="og:image" content={movie.poster} />
        <meta property="og:image:alt" content={movie.title} />
        <meta property="og:url" content={`${BASE_URL}/movies/${movie.slug}`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content={`${movie.title.split("Film ")[1]} - Movieku`}
          key="twitter:title"
        />
        <meta name="twitter:description" content={movie.synopsis} />
        <meta name="twitter:image" content={movie.poster} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="movies/[slug]" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "Movie",
            "image": "${movie.poster}",
            "url": "${BASE_URL}/movies/${movie.slug}",
            "dateCreated": "${movie.release}",
            "genre": "${movie.genres.join(", ")}",
            "actor": [
              ${movie.stars
                .map((star) => createStructuredActorData(star))
                .join(",")}
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "${Math.round(Number(movie.rating))}",
              "bestRating": "${Math.round(Number(movie.rating))}",
              "ratingCount": "10000"
            },
            "description": "${movie.synopsis}",
            "director": {
              "@type": "Person",
              "name": "${movie.director}"
            },
            "name": "${movie.title}"
          }`}
      </Script>

      <MoviesPageWrapper movie={movie}>
        <Header />
        <MovieComponent />
        <Footer />
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

  return {
    props: {
      movie,
    },
  };
};

export default MoviePage;
