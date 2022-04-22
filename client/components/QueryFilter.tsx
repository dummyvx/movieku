import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";

import { QuestionMarkCircleIcon, RefreshIcon } from "@heroicons/react/outline";
import { CardComponent } from "./";
import { CommandBoxData, InfoReponse } from "../types";
import { getNextMovies } from "../api/movies.api";
import { getNextSeries } from "../api/series.api";

export type InfoType = Record<"movies" | "series", InfoReponse>;

interface ITrendingsComponent {
  data: Array<CommandBoxData>;
  info: InfoType;
}

const TrendingsComponent: FunctionComponent<ITrendingsComponent> = ({
  data: rawData,
  info,
}) => {
  const router = useRouter();
  const query = router.asPath.split("?")[1];

  const [data, setData] = useState<Array<CommandBoxData>>(rawData);
  const [_info, setInfo] = useState<InfoType>(info);

  const getMoviesData = async () => {
    const isSeriesOnly = query?.includes("seriesOnly=true");
    if (_info.movies?.nextURL && !isSeriesOnly) {
      const movies = await getNextMovies(_info.movies.nextURL);
      if (!movies) return;

      const { data, info } = movies;
      const cleaned: Array<CommandBoxData> = data.map((movie) => ({
        duration: movie.duration,
        poster: movie.poster,
        rating: movie.rating,
        slug: movie.slug,
        title: movie.title,
      }));

      setData((prev) => [...prev, ...cleaned]);
      setInfo((prev) => ({ ...prev, movies: info }));
    }
  };

  const getSeriesData = async () => {
    const isMovieOnly = query?.includes("movieOnly=true");
    if (_info.series?.nextURL && !isMovieOnly) {
      const series = await getNextSeries(_info.series.nextURL);
      if (!series) return;

      const { data, info } = series;
      const cleaned: Array<CommandBoxData> = data.map((seriess) => ({
        duration: seriess.duration,
        poster: seriess.poster,
        rating: seriess.rating,
        slug: seriess.slug,
        title: seriess.title,
        status: seriess.status,
      }));

      setData((prev) => [...prev, ...cleaned]);
      setInfo((prev) => ({ ...prev, series: info }));
    }
  };

  const getMoreData = async () => {
    await getMoviesData();
    await getSeriesData();
  };

  return (
    <section about="popular-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <QuestionMarkCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <h2 className="text-lg md:text-2xl text-white font-medium tracking-wide ">
            Filter Results
          </h2>
        </div>
      </div>

      {data.length > 0 ? (
        <InfiniteScroll
          dataLength={data.length}
          hasMore={Boolean(_info.series?.nextURL || _info.movies?.nextURL)}
          next={getMoreData}
          loader={<span>Loading...</span>}
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          <div className="grid h-full grid-cols-2 md:grid-cols-6 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
            {data.length > 0 &&
              data.map((item, index) => {
                const getType = () => (item.status ? "series" : "movies");

                return (
                  <Link
                    href={`/${getType()}/${item.slug}`}
                    key={item.slug + index}
                  >
                    <a className="mb-5">
                      <CardComponent
                        imageURL={item.poster}
                        cardLabel={item.title}
                        rating={item.rating}
                      />
                    </a>
                  </Link>
                );
              })}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="h-screen -mt-20 md:-mt-32 flex-col space-y-5 md:space-y-10 w-full flex items-center justify-center">
          <h2 className="text-gray-600 animate-pulse font-poppins text-lg md:text-2xl">
            No data found!
          </h2>
        </div>
      )}
    </section>
  );
};

export default TrendingsComponent;
