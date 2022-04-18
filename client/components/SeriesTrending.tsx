import { FireIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { FunctionComponent, useContext, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { getNextSeries } from "../api/series.api";
import { SeriesContext } from "../contexts/SeriesContext";
import { CardComponent } from "./";

const SeriesTrendingComponent: FunctionComponent = () => {
  const { trendingSeries, addTrendingSeries } = useContext(SeriesContext);
  if (!trendingSeries) return <></>;

  const [infoData, setInfoData] = useState(trendingSeries.info);

  const getMoreData = () => {
    getNextSeries(`${infoData.nextURL}&limit=32`)
      .then((newSeries) => {
        if (newSeries) {
          addTrendingSeries(newSeries.data);
          setInfoData((prev) => ({ ...prev, ...newSeries.info }));
          return;
        }

        console.error(`Error due to no new series!`);
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <section about="newest-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FireIcon className="w-8 h-8 text-white" />
          <h2 className="text-2xl text-white font-medium tracking-wide ">
            Trending Series
          </h2>
        </div>
      </div>

      <InfiniteScroll
        dataLength={trendingSeries.data.length}
        hasMore={Boolean(trendingSeries.info.nextURL)}
        next={getMoreData}
        loader={<span>Loading...</span>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <div className="grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-5">
          {trendingSeries.data.map((series, index) => (
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

export default SeriesTrendingComponent;
