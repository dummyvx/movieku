import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getBookmarks } from "../api";

import { Header, Footer, BookmarksComponent } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import { CommandBoxData } from "../types";

const CompletePage: NextPage = () => {
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
        <title>Your Bookmarks - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
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

export default CompletePage;
