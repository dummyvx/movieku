import { ReactNode } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { Header, QueryFilter } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import Footer from "../components/Footer";

const HomeWrapper = ({ children }: { children: ReactNode }) => (
  <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
);

const FilterPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Filter Page - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeWrapper>
        <Header />
        <QueryFilter />
        <Footer />
      </HomeWrapper>
    </div>
  );
};

export default FilterPage;
