import { FunctionComponent, useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  MenuIcon,
  ColorSwatchIcon,
  CreditCardIcon,
  HomeIcon,
  ShieldCheckIcon,
  SpeakerphoneIcon,
  FilmIcon,
  SearchIcon,
  BookmarkIcon,
} from "@heroicons/react/outline";
import { CommandBoxData, HeaderInitValue } from "../types";
import Sidebar from "./Sidebar";
import { CommandBox } from ".";
import useDebounce from "../hooks/useDebounce";
import { search } from "../api";
import { CommandBoxContext } from "../contexts/CommandBoxContext";

interface IHeader {}

const Header: FunctionComponent<IHeader> = () => {
  const router = useRouter();
  const { pathname } = router;

  const headerInitValue: HeaderInitValue = {
    Home: {
      name: "Home",
      Icon: HomeIcon,
      isActive: pathname === "/",
      href: "/",
    },
    Movies: {
      name: "Movies",
      Icon: FilmIcon,
      isActive: pathname === "/movies",
      href: "/movies",
    },
    Series: {
      name: "Series",
      Icon: ColorSwatchIcon,
      isActive: pathname === "/series",
      href: "/series",
    },
    BluRay: {
      name: "BluRay",
      Icon: CreditCardIcon,
      isActive: pathname === "/bluray",
      href: "/bluray",
    },
    Complete: {
      name: "Complete",
      Icon: ShieldCheckIcon,
      isActive: pathname === "/complete",
      href: "/complete",
    },
    Ongoing: {
      name: "Ongoing",
      Icon: SpeakerphoneIcon,
      isActive: pathname === "/ongoing",
      href: "/ongoing",
    },
    Bookmarks: {
      name: "Bookmarks",
      Icon: BookmarkIcon,
      isActive: pathname === "/bookmarks",
      href: "/bookmarks",
    },
  };

  const [, setIsCommandBoxOpen] = useContext(CommandBoxContext);

  const [sidebar, setSidebar] = useState(false);
  const [headerLists, setHeaderLists] = useState(headerInitValue);
  const [keyword, setKeyWord] = useState("");
  const [searchedData, setSearchedData] = useState<Array<CommandBoxData>>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const debounceValue = useDebounce(keyword, 300);

  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(debounceValue);
  }, [debounceValue]);

  useEffect(() => {
    setIsSearchLoading(true);
    if (query) {
      search(query)
        .then((data) => {
          if (data) {
            setSearchedData(data);
            setQuery("");
            return;
          }
          setIsSearchLoading(false);
          console.log({ error: "No data found!" });
        })
        .catch((err) => {
          console.log({ err: err.message });
          setIsSearchLoading(false);
        });
    }
  }, [query]);

  return (
    <>
      <CommandBox
        data={searchedData}
        setKeyword={setKeyWord}
        keyword={keyword}
        isLoading={isSearchLoading}
        debounceValue={query}
        setSearchedData={setSearchedData}
      />
      <header className="fixed bg-[#0d0d0f] top-0 w-full left-0 z-40 h-24 flex items-center border-b border-b-gray-800/70 px-4 sm:px-10 md:px-14">
        <section className="flex items-center justify-between w-full">
          <ul className="hidden font-poppins text-gray-300 md:flex items-center lg:space-x-12 md:space-x-6 overflow-hidden md:w-[90%] lg:w-[60%] mr-10">
            {Object.entries(headerLists).map(([_, item], index) => (
              <li key={index} className="">
                <Link href={item.href}>
                  <a
                    className={`text-sm lg:text-base md:uppercase lg:normal-case text-clip whitespace-nowrap ${
                      item.isActive
                        ? "font-medium text-white"
                        : "font-light text-gray-400"
                    } tracking-wide  hover:text-gray-200 duration-150 transition-all`}
                  >
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className="md:hidden cursor-pointer"
            onClick={() => setSidebar(!sidebar)}
          >
            <MenuIcon className="w-6 h-6 text-white" />
          </div>

          <Sidebar
            headerLists={headerLists}
            setHeaderLists={setHeaderLists}
            setSidebar={setSidebar}
            sidebar={sidebar}
          />

          <div
            onClick={() => setIsCommandBoxOpen((prev) => !prev)}
            className="flex items-center px-3 md:px-5 cursor-pointer rounded-lg bg-gray-800 hover:bg-gray-700 duration-50 transition-all shadow-lg py-[13px] w-[85%] xl:w-[30%] lg:w-[35%]"
          >
            <div className="mr-4">
              <SearchIcon className="w-5 h-5 text-gray-300" />
            </div>
            <input
              type="text"
              className="flex-grow w-[100%] md:w-full cursor-pointer outline-none font-poppins bg-transparent text-gray-300 text-sm"
              placeholder="Search..."
              readOnly
            />

            <span className="text-gray-400 w-[30%] md:w-[23%] font-poppins font-medium text-xs xl:text-sm">
              Ctrl + /
            </span>
          </div>
        </section>
      </header>
      <div className="mt-24 py-2" />
    </>
  );
};

export default Header;
