import { FunctionComponent, useContext } from "react";
import { FireIcon } from "@heroicons/react/outline";
import Link from "next/link";

import { SeriesContext } from "../contexts/SeriesContext";
import { CardComponent } from "./";

const TrendingSeries: FunctionComponent = () => {
  const { trendingSeries } = useContext(SeriesContext);

  return trendingSeries ? (
    <section about="trending-movies" className="mt-4">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <FireIcon className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          <h2 className="text-base md:text-xl text-red-500 font-medium tracking-wide">
            Popular Series
          </h2>
        </div>

        <Link href="/series/trending">
          <a className="text-base text-gray-400 font-normal hover:text-gray-300 duration-150 transition">
            See all {">"}
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-7 items-center gap-2 md:gap-5 mt-5">
        {trendingSeries.data.map((seri, index) => {
          return (
            <Link href={`/series/${seri.slug}`} key={index}>
              <a className="mb-5">
                <CardComponent
                  imageURL={seri.poster}
                  cardLabel={seri.title}
                  rating={seri.rating}
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

export default TrendingSeries;
