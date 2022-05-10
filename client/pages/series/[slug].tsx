import { FunctionComponent, ReactNode } from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import Head from "next/head";

import { Series } from "../../types";
import { Footer, Header, OneSeriesComponent } from "../../components";
import CommandBoxContextProvider from "../../contexts/CommandBoxContext";
import SeriesContextProvider from "../../contexts/SeriesContext";
import Script from "next/script";
import createStructuredActorData from "../../helpers/createStructuredActorData";

interface ISeriesPage {
  seri: Series;
}

const SeriesPageWrapper = ({
  seri,
  children,
}: {
  seri: ISeriesPage["seri"];
  children: ReactNode;
}) => (
  <SeriesContextProvider seri={seri}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const MoviePage: FunctionComponent<ISeriesPage> = ({ seri }) => {
  if (!seri) return <></>;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-1 px-4 sm:px-10 md:px-14">
      <Head>
        <title>{seri.title.split("Film ")[1]} - Movieku</title>
        <meta name="description" content="Movieku create using Next.js" />
        <meta name="image" content={seri.poster} />
        <meta name="url" content={`${BASE_URL}/series/${seri.slug}`} />

        <meta
          property="og:title"
          content={`${seri.title.split("Film ")[1]} - Movieku`}
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta property="og:description" content={seri.synopsis} />
        <meta property="og:image" content={seri.poster} />
        <meta property="og:image:alt" content={seri.title} />
        <meta property="og:url" content={`${BASE_URL}/series/${seri.slug}`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content={`${seri.title.split("Film ")[1]} - Movieku`}
          key="twitter:title"
        />
        <meta name="twitter:description" content={seri.synopsis} />
        <meta name="twitter:image" content={seri.poster} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script id="series/[slug]" type="application/ld+json">
        {`{
            "@context": "https://schema.org",
            "@type": "Movie",
            "image": "${seri.poster}",
            "url": "${BASE_URL}/movies/${seri.slug}",
            "dateCreated": "${seri.release}",
            "genre": "${seri.genres.join(", ")}",
            "actor": [
              ${seri.stars
                .map((star) => createStructuredActorData(star))
                .join(",")}
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "${Math.round(Number(seri.rating))}",
              "bestRating": "${Math.round(Number(seri.rating))}",
              "ratingCount": "10000"
            },
            "description": "${seri.synopsis}",
            "director": {
              "@type": "Person",
              "name": "${seri.director}"
            },
            "name": "${seri.title}"
          }`}
      </Script>

      <SeriesPageWrapper seri={seri}>
        <Header />
        <OneSeriesComponent />
        <Footer />
      </SeriesPageWrapper>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const slug = params?.slug;

  if (!slug)
    return {
      props: {
        seri: null,
      },
    };

  const {
    data: { data: seri },
  } = await axios.get(`${SERVER_URL}/series/${slug}/one`);

  return {
    props: {
      seri,
    },
  };
};

export default MoviePage;
