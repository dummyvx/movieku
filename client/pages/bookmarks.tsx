import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getBookmarks } from "../api";

import { Header, Footer, BookmarksComponent } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { CommandBoxData } from "../types";

interface IBookmarksPage {}

const BookmarksPage: NextPage<IBookmarksPage> = () => {
  const [data, setData] = useState<Array<CommandBoxData>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const storage = localStorage.getItem("bookmarks");
    const bookmarks: Array<string> = storage ? JSON.parse(storage) : [];

    if (bookmarks.length) {
      setIsLoading(true);
      getBookmarks(bookmarks)
        .then((value) => {
          if (value) {
            setData(value);
            setIsLoading(false);
            return;
          }
        })
        .catch((err) => console.error({ err }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Your Bookmarks - Movieku</title>
        <meta name="description" content="My Bookmarks" />

        <meta name="image" content={`${BASE_URL}/vercel.svg`} />
        <meta name="url" content={`${BASE_URL}/bookmarks`} />

        <meta
          property="og:title"
          content="Your Bookmarks - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="video.movie" />
        <meta property="og:description" content="My Bookmarks" />
        <meta property="og:image" content={`${BASE_URL}/vercel.svg`} />
        <meta property="og:url" content={`${BASE_URL}/bookmarks`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Your Bookmarks - Movieku"
          key="twitter:title"
        />
        <meta name="twitter:description" content="My Bookmarks" />
        <meta name="twitter:image" content={`${BASE_URL}/vercel.svg`} />
        <link rel="icon" href="/favicon.ico" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CommandBoxContextProvider>
        <Header />
        <BookmarksComponent data={data} isLoading={isLoading} />
        <Footer />
      </CommandBoxContextProvider>
    </div>
  );
};

export default BookmarksPage;
