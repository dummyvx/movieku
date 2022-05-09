import { FilmIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { getNextMovies } from "../api/movies.api";
import { MovieContext } from "../contexts/MovieContext";
import { CardComponent } from "./";

const BlurayComponent: FunctionComponent = () => {
  const { bluray, addBluray } = useContext(MovieContext);

  const [infoData, setInfoData] = useState(bluray?.info);

  const getMoreData = () => {
    getNextMovies(`${infoData?.nextURL}&limit=32`)
      .then((newMovies) => {
        if (newMovies) {
          addBluray(newMovies.data);
          setInfoData((prev) => ({ ...prev, ...newMovies.info }));
          return;
        }

        console.error(`Error due to no new movies!`);
      })
      .catch((err) => console.error({ err }));
  };

  if (!bluray) return <></>;

  return (
    <section about="newest-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FilmIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <h2 className="text-lg md:text-xl text-white font-medium tracking-wide ">
            Bluray Quality
          </h2>
        </div>
      </div>

      <InfiniteScroll
        dataLength={bluray.data.length}
        hasMore={Boolean(bluray.info.nextURL)}
        next={getMoreData}
        loader={<span>Loading...</span>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div className="grid h-full grid-cols-2 md:grid-cols-6 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
          {bluray.data.map((movie, index) => (
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

export default BlurayComponent;
