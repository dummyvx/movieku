import { FunctionComponent, useContext } from "react";
import { FireIcon } from "@heroicons/react/outline";
import Link from "next/link";

import { MovieContext } from "../contexts/MovieContext";
import { CardComponent } from "./";

const TrendingMovies: FunctionComponent = () => {
  const { trendingMovies } = useContext(MovieContext);

  return trendingMovies ? (
    <section about="trending-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FireIcon className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          <h2 className="text-base md:text-2xl text-red-500 font-medium tracking-wide">
            Popular Movies
          </h2>
        </div>

        <Link href="/movies/trending">
          <a className="text-base text-gray-400 font-normal hover:text-gray-300 duration-150 transition">
            See all {">"}
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-7 items-center gap-2 md:gap-5 mt-5">
        {trendingMovies.data.slice(1, 8).map((movie, index) => {
          return (
            <Link href={`/movies/${movie.slug}`} key={index}>
              <a className="mb-5">
                <CardComponent
                  imageURL={movie.poster}
                  cardLabel={movie.title}
                  rating={movie.rating}
                />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  ) : (
    <></>
  );
};

export default TrendingMovies;
