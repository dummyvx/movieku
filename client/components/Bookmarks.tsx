import { FunctionComponent } from "react";
import Link from "next/link";
import { BookmarkIcon } from "@heroicons/react/outline";

import { CommandBoxData } from "../types";
import { CardComponent } from "./";

interface IBookmarksComponent {
  data: Array<CommandBoxData>;
}

const BookmarksComponent: FunctionComponent<IBookmarksComponent> = ({
  data,
}) => {
  const getTypeURL = (status?: string) => (status ? "series" : "movies");

  return (
    <section about="bookmarks" className="mt-4 min-h-screen">
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center space-x-3">
          <BookmarkIcon className="w-8 h-8 text-white" />
          <h2 className="text-2xl text-white font-medium tracking-wide ">
            Bookmarks
          </h2>
        </div>
      </div>

      {data.length ? (
        <div className="grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 items-center gap-2 md:gap-5 mt-10">
          {data.map((item: CommandBoxData & { status?: string }, index) => (
            <Link href={`/${getTypeURL(item.status)}/${item.slug}`} key={index}>
              <a className="mb-5">
                <CardComponent
                  imageURL={item.poster}
                  cardLabel={item.title}
                  rating={item.rating}
                />
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center">
          <h1 className="text-gray-600 font-poppins text-2xl font-medium">
            You don't have any bookmarks
          </h1>
        </div>
      )}
    </section>
  );
};

export default BookmarksComponent;
