import { ReactNode } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";

import { Header, OngoingComponent } from "../components";
import CommandBoxContextProvider from "../contexts/CommandBoxContext";
import SeriesContextProvider from "../contexts/SeriesContext";
import { APIResponse, Series } from "../types";

interface IOngoingPage {
  ongoing: APIResponse<Array<Series>>;
}

const OngoingPageWrapper = ({
  ongoing,
  children,
}: {
  ongoing: APIResponse<Series[]>;
  children: ReactNode;
}) => (
  <SeriesContextProvider ongoing={ongoing}>
    <CommandBoxContextProvider>{children}</CommandBoxContextProvider>
  </SeriesContextProvider>
);

const CompletePage: NextPage<IOngoingPage> = ({ ongoing }) => {
  return (
    <div className="min-h-screen bg-[#0d0d0f] relative z-10 px-10 md:px-14 ">
      <Head>
        <title>Ongoing Series - Next.js</title>
        <meta name="description" content="Movieku create using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <OngoingPageWrapper ongoing={ongoing}>
        <Header />
        <OngoingComponent />
      </OngoingPageWrapper>
    </div>
  );
};

export async function getServerSideProps() {
  const SERVER_URL = `${process.env.SERVER_URL}/api/v1`;

  const { data: ongoing } = await axios.get(
    `${SERVER_URL}/series?limit=32&status=Ongoing`
  );

  return {
    props: {
      ongoing,
    },
  };
}

export default CompletePage;