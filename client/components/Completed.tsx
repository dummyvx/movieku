import { FilmIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { getNextSeries } from "../api/series.api";
import { SeriesContext } from "../contexts/SeriesContext";
import { CardComponent } from "./";

const CompletedComponent: FunctionComponent = () => {
  const { completed, addCompleted } = useContext(SeriesContext);

  const [infoData, setInfoData] = useState(completed!.info);

  const getMoreData = () => {
    getNextSeries(`${infoData.nextURL}&limit=32`)
      .then((newSeries) => {
        if (newSeries) {
          addCompleted(newSeries.data);
          setInfoData((prev) => ({ ...prev, ...newSeries.info }));
          return;
        }

        console.error(`Error due to no new series!`);
      })
      .catch((err) => console.error({ err }));
  };

  if (!completed) return <></>;

  return (
    <section about="newest-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FilmIcon className="w-8 h-8 text-white" />
          <h2 className="text-2xl text-white font-medium tracking-wide ">
            Completed Series
          </h2>
        </div>
      </div>

      <InfiniteScroll
        dataLength={completed.data.length}
        hasMore={Boolean(completed.info.nextURL)}
        next={getMoreData}
        loader={<span>Loading...</span>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div className="grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
          {completed.data.map((series, index) => (
            <Link href={`/series/${series.slug}`} key={index}>
              <a className="mb-5">
                <CardComponent
                  imageURL={series.poster}
                  cardLabel={series.title}
                  rating={series.rating}
                />
              </a>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default CompletedComponent;
