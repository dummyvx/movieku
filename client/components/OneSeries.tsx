import { Fragment, FunctionComponent, useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { BookmarkIcon, DownloadIcon, ShareIcon } from "@heroicons/react/solid";

import { useOneSeriesPageLogic } from "../hooks/useOneSeriesPageLogic";
import { useBookmarks } from "../hooks/useBookmarks";
import { ToastInfoType } from "./Toast";
import { Toast } from "./";
import { SeriesContext } from "../contexts/SeriesContext";

const OneSeriesComponent: FunctionComponent = () => {
  const { seri } = useContext(SeriesContext);

  const router = useRouter();
  const URL = router.asPath;

  const toastState = useState<ToastInfoType>({
    ["bookmarks"]: {
      status: false,
      type: "info",
    },
  });

  const [toastInfo, setToastInfo] = toastState;

  const {
    dura,
    title,
    year,
    copiedToClipboard: onClipboard,
    copyToClipboard,
  } = useOneSeriesPageLogic(seri!);
  const { onBookmark, onToastClose, toogleBookmark } = useBookmarks({
    slug: seri!.slug,
    toastState,
  });

  const addBookmarkToast = () => {
    setToastInfo((prev) => ({
      ...prev,
      ["bookmarks"]: {
        status: true,
        label: "A Series has been added",
        msg: `${title} added to bookmarks`,
        type: "info",
      },
    }));
    return;
  };

  const removeBookmarksToast = () => {
    setToastInfo((prev) => ({
      ...prev,
      ["bookmarks"]: {
        status: true,
        label: "A Series has been removed from bookmarks",
        msg: `${title} successfully removed from bookmarks`,
        type: "warn",
      },
    }));
  };

  const episode = (ep: string) =>
    ep.split(`Download ${title.split(" Episode")[0]}`)[1];

  const scrollToDownloadSection = () => {
    const downloadSection =
      document.querySelector("#download-section")?.scrollWidth;
    if (!downloadSection) return;
    window.scrollTo({
      left: 0,
      top: downloadSection - 950,
      behavior: "smooth",
    });
  };

  if (!seri) return <></>;

  return (
    <Fragment>
      {toastInfo && (
        <Toast
          show={toastInfo["bookmarks"]?.status}
          onClose={onToastClose}
          label={
            toastInfo["bookmarks"]?.status ? toastInfo["bookmarks"]?.label : ""
          }
          msg={
            toastInfo["bookmarks"]?.status ? toastInfo["bookmarks"]?.msg : ""
          }
          type={toastInfo["bookmarks"]?.type}
        />
      )}
      <section about={seri.title} className="w-full space-y-10 pb-16 py-2">
        <div className="flex flex-col justify-between space-y-3 sm:space-y-5 md:space-y-10">
          {/* Poster and Series details */}
          <div className="flex items-start space-x-8 w-auto">
            <div className="w-20 sm:w-32 md:w-40 lg:w-40 relative">
              <Image
                width={1080}
                height={1920}
                src={seri.poster}
                objectFit="cover"
                className="rounded-lg"
                alt={seri.title}
              />

              <div
                className={`hidden md:block text-xs text-gray-200 font-poppins w-24 text-center uppercase absolute transform top-5 -left-4 leading-none py-1 -rotate-45 ${
                  seri.status.toLowerCase() === "completed"
                    ? "bg-indigo-500"
                    : "bg-yellow-500"
                } rounded-full font-medium px-3`}
              >
                {seri.status}
              </div>
            </div>

            <div className="flex items-start flex-col space-y-10">
              <div className="font-poppins text-gray-200 flex flex-col items-start justify-between sm:h-32 md:h-40 lg:h-[275px]">
                <div className="font-poppins font-light md:mb-8">
                  <h2 className="text-base sm:text-2xl md:text-3xl font-medium mb-2 lg:mb-4">
                    {title}
                  </h2>

                  <div className="hidden md:block border-t border-gray-800">
                    <h5 className="text-gray-300/90 text-[15px] my-2 mb-3">
                      <span className="lg:mr-14">Director:</span>{" "}
                      {seri.director}
                    </h5>
                  </div>
                  <div className="hidden md:block border-t border-gray-800">
                    <h5 className="text-gray-300/90 text-[15px] my-2 mb-3">
                      <span className="lg:mr-[17px]">Release Date:</span>{" "}
                      {seri.release}
                    </h5>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    {seri.genres.map((genre, index) => (
                      <Link href={`/filter?genres=${genre}`} key={genre}>
                        <a
                          key={index}
                          className="border inline-block mr-1 lg:mr-2 mb-1 sm:mb-2 border-slate-600 text-slate-400 text-[7px] sm:text-[11px] lg:text-xs leading-tight text-center uppercase px-3 py-1 md:px-4 md:py-2 rounded-full hover:bg-slate-300 transition-all duration-100 hover:text-slate-600"
                        >
                          {genre}
                        </a>
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      className="px-6 sm:px-8 md:px-16 flex relative items-center border-none cursor-pointer py-3 sm:py-4 md:py-5 text-center text-sm leading-none bg-indigo-500 rounded-full text-white font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
                      type="button"
                      onClick={scrollToDownloadSection}
                    >
                      <DownloadIcon className="w-5 h-5 absolute left-6 hidden md:block text-white leading-none" />
                      <h5 className="text-center text-[10px] sm:text-sm">
                        Download
                      </h5>
                    </button>

                    <button
                      onClick={() =>
                        toogleBookmark(
                          title,
                          addBookmarkToast,
                          removeBookmarksToast
                        )
                      }
                      type="button"
                      className={`p-2 sm:p-3 rounded-full border-2 border-red-600 cursor-pointer transition-all ease-in-out group duration-500 hover:border-indigo-500 ${
                        onBookmark
                          ? "transition-all duration-100 border-green-500 hover:border-gray-500"
                          : ""
                      }`}
                    >
                      <BookmarkIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          onBookmark
                            ? "text-green-500 group-hover:text-gray-500"
                            : "text-red-500"
                        } group-hover:text-indigo-500 transition-all ease-in-out duration-100 group-disabled:group-hover:text-gray-500`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className={`p-2 sm:p-3 rounded-full border cursor-pointer transition-all ease-in-out group duration-300 ${
                        onClipboard
                          ? "border-2 border-green-600 hover:border-green-500"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <ShareIcon
                        className={`w-5 h-5 ${
                          onClipboard
                            ? "text-green-500 group-hover:text-green-500"
                            : "text-gray-200 group-hover:text-gray-100"
                        } transition-all ease-in-out duration-100`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trailer */}
          {seri.trailer && (
            <div>
              <iframe
                src={seri.trailer}
                allowFullScreen
                width="100%"
                className="min-h-screen"
              />
            </div>
          )}

          {/* Duration and Synopsis */}
          <div className="flex items-start w-full justify-between space-x-8">
            <div className="font-poppins w-[20%] md:w-[26%] lg:w-[16%] xl:w-[12%]">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-light text-gray-200">
                {year}
              </h3>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-light text-gray-200 uppercase">
                {dura ?? seri.duration}
              </h3>
            </div>

            <div className="flex items-start w-[80%] lg:w-[88%] space-x-10">
              <div className="font-poppins">
                <h3 className="text-gray-100 font-medium uppercase text-xs md:text-sm lg:text-base leading-none mb-6 lg:mb-3">
                  Storyline | Sinopsis
                </h3>

                <p className="text-gray-400 text-[12px] md:text-sm lg:text-base font-light">
                  {seri.synopsis}
                </p>
              </div>

              <div className="hidden md:block"></div>
            </div>
          </div>
        </div>

        <div id="download-section">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-y-7 lg:gap-x-8">
            {seri.links.map((link, index) => (
              <div
                key={link.episode + index}
                className="font-poppins text-gray-200"
              >
                <h5 className="text-lg md:text-xl lg:text-2xl font-medium mb-5">
                  {episode(link.episode)}
                </h5>
                {link.links.map(({ links, quality }, index) => (
                  <div
                    key={`${quality} - ${index}`}
                    className="border-t last:mb-5 border-gray-500 mt-5 pt-3 font-poppins text-gray-100 text-base"
                  >
                    <dt className="font-medium uppercase">{quality}</dt>
                    <div className="flex space-x-2 md:space-x-3 lg:space-x-5 xl:space-x-6 mt-3">
                      {links.map(({ provider, src }) => (
                        <Link href={src} key={provider.toLowerCase()} passHref>
                          <a
                            target="_blank"
                            className={`px-4 sm:px-3 sm:text-center text-xs md:px-5 inline-flex relative items-center leading-tight border-none cursor-pointer py-2 md:py-3 md:rounded-full text-center bg-indigo-500 rounded-sm text-gray-100 font-medium hover:brightness-125 duration-100 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500`}
                          >
                            <span>{provider}</span>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Fragment>
  );
};

/* 
<div
  key={`${link.quality} - ${index}`}
  className="border-t border-gray-500 pt-3 font-poppins text-gray-100 text-base"
>
  <dt className="font-medium uppercase">{link.quality}</dt>

  <div className="flex space-x-2 md:space-x-3 lg:space-x-5 mt-3">
    {link.links.map(({ provider, src }, index) => (
      <Link href={src} key={provider.toLowerCase()} passHref>
        <a
          target="_blank"
          className={`px-4 sm:px-3 sm:text-center text-xs md:px-5 inline-flex relative items-center leading-tight border-none cursor-pointer py-2 md:py-3 md:rounded-full text-center bg-indigo-500 rounded-sm text-gray-100 font-medium hover:brightness-125 duration-100 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500`}
        >
          <span>{provider}</span>
        </a>
      </Link>
    ))}
  </div>
</div>
*/

export default OneSeriesComponent;
