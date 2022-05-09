import { FireIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { getNextSeries } from "../api/series.api";
import { SeriesContext } from "../contexts/SeriesContext";
import { CardComponent } from "./";

const OngoingComponent: FunctionComponent = () => {
  const { ongoing, addOngoing } = useContext(SeriesContext);

  const [infoData, setInfoData] = useState(ongoing!.info);

  const getMoreData = () => {
    getNextSeries(`${infoData.nextURL}&limit=32`)
      .then((newSeries) => {
        if (newSeries) {
          addOngoing(newSeries.data);
          setInfoData((prev) => ({ ...prev, ...newSeries.info }));
          return;
        }

        console.error(`Error due to no new series!`);
      })
      .catch((err) => console.error({ err }));
  };

  if (!ongoing) return <></>;

  return (
    <section about="newest-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FireIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <h2 className="text-lg md:text-xl text-white font-medium tracking-wide ">
            Ongoing Series
          </h2>
        </div>
      </div>

      <InfiniteScroll
        dataLength={ongoing.data.length}
        hasMore={Boolean(ongoing.info.nextURL)}
        next={getMoreData}
        loader={<span>Loading...</span>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div className="grid h-full grid-cols-2 md:grid-cols-6 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
          {ongoing.data.map((series, index) => (
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

export default OngoingComponent;
