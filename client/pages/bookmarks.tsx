import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getBookmarks } from "../api";

import { Header, Footer, BookmarksComponent } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { CommandBoxData } from "../types";

interface IBookmarksPage {
  baseURL: string;
}

const BookmarksPage: NextPage<IBookmarksPage> = ({ baseURL }) => {
  const [data, setData] = useState<Array<CommandBoxData>>([]);
  const [isLoading, setIsLoading] = useState(false);

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

        <meta name="image" content={`${baseURL}/vercel.svg`} />
        <meta name="url" content={`${baseURL}/bookmarks`} />

        <meta
          property="og:title"
          content="Your Bookmarks - Movieku"
          key="og:title"
        />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="My Bookmarks" />
        <meta property="og:image" content={`${baseURL}/vercel.svg`} />
        <meta property="og:url" content={`${baseURL}/bookmarks`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@novqigarrix" />
        <meta
          name="twitter:title"
          content="Your Bookmarks - Movieku"
          key="twitter:title"
        />
        <meta name="twitter:description" content="My Bookmarks" />
        <meta name="twitter:image" content={`${baseURL}/vercel.svg`} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    req: {
      headers: { host },
    },
  } = context;

  return {
    props: {
      baseURL: host,
    },
  };
};

export default BookmarksPage;
