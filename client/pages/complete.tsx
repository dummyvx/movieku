import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, CompletedComponent } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import { APIResponse, Series } from "../types";

interface ICompletePage {
  complete: APIResponse<Array<Series>>;
}

const CompletePageWrapper = ({
  complete,
  children,
}: {
  complete: APIResponse<Series[]>;
  children: ReactNode;
}) => (
  <SeriesContextProvider completed={complete}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const CompletePage: NextPage<ICompletePage> = ({ complete }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Completed Series - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CompletePageWrapper complete={complete}>
        <Header />
        <CompletedComponent />
      </CompletePageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: complete } = await axios.get(
    `${SERVER_URL}/series?limit=32&status=Completed`
  );

  return {
    props: {
      complete,
    },
  };
}

export default CompletePage;
