import { FireIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { getNextMovies } from "../api/movies.api";
import { MovieContext } from "../contexts/MovieContext";
import { CardComponent } from "./";

const TrendingsComponent: FunctionComponent = () => {
  const { trendingMovies, addTrendingMovies } = useContext(MovieContext);
  if (!trendingMovies) return <></>;

  const [infoData, setInfoData] = useState(trendingMovies.info);

  const getMoreData = () => {
    getNextMovies(`${infoData.nextURL}&limit=32`)
      .then((newMovies) => {
        if (newMovies) {
          addTrendingMovies(newMovies.data);
          setInfoData((prev) => ({ ...prev, ...newMovies.info }));
        }

        console.error(`Error due to no new movies!`);
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <section about="popular-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FireIcon className="w-8 h-8 text-white" />
          <h2 className="text-2xl text-white font-medium tracking-wide ">
            Popular Movies
          </h2>
        </div>
      </div>

      <InfiniteScroll
        dataLength={trendingMovies.data.length}
        hasMore={Boolean(trendingMovies.info.nextURL)}
        next={getMoreData}
        loader={<span>Loading...</span>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div className="grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
          {trendingMovies.data.map((movie, index) => (
            <Link href={`/movies/${movie.slug}`} key={index}>
              <a className="mb-5">
                <CardComponent
                  imageURL={movie.poster}
                  cardLabel={movie.title}
                  rating={movie.rating}
                />
              </a>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default TrendingsComponent;
