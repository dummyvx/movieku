import { FilmIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { getNextSeries } from "../api/series.api";
import { SeriesContext } from "../contexts/SeriesContext";
import { CardComponent } from "./";

const SeriesComponent: FunctionComponent = () => {
  const { series, addSeries } = useContext(SeriesContext);
  if (!series) return <></>;

  const [infoData, setInfoData] = useState(series.info);

  const getMoreData = () => {
    getNextSeries(`${infoData.nextURL}&limit=32`)
      .then((newSeries) => {
        if (newSeries) {
          addSeries(newSeries.data);
          setInfoData((prev) => ({ ...prev, ...newSeries.info }));
        }

        console.error(`Error due to no new series!`);
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <section about="newest-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FilmIcon className="w-8 h-8 text-white" />
          <h2 className="text-2xl text-white font-medium tracking-wide ">
            Latest Series
          </h2>
        </div>
      </div>

      <InfiniteScroll
        dataLength={series.data.length}
        hasMore={Boolean(series.info.nextURL)}
        next={getMoreData}
        loader={<span>Loading...</span>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div className="grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
          {series.data.map((movie, index) => (
            <Link href={`/series/${movie.slug}`} key={index}>
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

export default SeriesComponent;