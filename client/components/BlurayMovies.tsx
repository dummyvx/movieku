import { FunctionComponent, useContext } from "react";
import { FireIcon } from "@heroicons/react/outline";
import Link from "next/link";

import { MovieContext } from "../contexts/MovieContext";
import { CardComponent } from "./";

const BlurayMovies: FunctionComponent = () => {
  const { bluray } = useContext(MovieContext);
  if (!bluray) return <></>;

  return (
    <section about="bluray-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FireIcon className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl text-red-500 font-medium tracking-wide ">
            Bluray Quality
          </h2>
        </div>

        <Link href="/bluray">
          <a className="text-base text-gray-400 font-normal hover:text-gray-300 duration-150 transition">
            See all {">"}
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
        {bluray.data.map((movie, index) => {
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
  );
};

export default BlurayMovies;
