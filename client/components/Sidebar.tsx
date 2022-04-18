import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";

import { HeaderInitValue, HeaderNames } from "../types";

interface ISidebar {
  headerLists: HeaderInitValue;
  setHeaderLists: Dispatch<SetStateAction<HeaderInitValue>>;
  setSidebar: Dispatch<SetStateAction<boolean>>;
  sidebar: boolean;
}

const Sidebar: FunctionComponent<ISidebar> = (props) => {
  const { headerLists, setHeaderLists, setSidebar, sidebar } = props;

  const sidebarRef = useRef<HTMLDivElement>(null);

  const changeHeaderIsActive = (name: HeaderNames) => {
    const currentHeader = Object.entries(headerLists).find(
      ([_, item]) => item.isActive === true
    )?.[1];

    if (!currentHeader) return;

    setHeaderLists((prev) => ({
      ...prev,
      [currentHeader.name]: { ...prev[currentHeader.name], isActive: false },
      [name]: { ...prev[name], isActive: !prev[name].isActive },
    }));
  };

  const handleClickOutside = useCallback(
    (ev: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current?.contains(ev.target as Node)
      ) {
        setSidebar(false);
      }
    },
    [setSidebar]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div
      ref={sidebarRef}
      className={`absolute left-0 top-0 z-30 bg-[#1a171e] md:py-20 h-screen transition-all duration-200 flex items-center font-poppins w-[55%] space-y-5 md:hidden transform ${
        sidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-64"
      }`}
    >
      <div className="w-full">
        <h3 className="uppercase mt-8 text-sm text-gray-300 pl-7">Menu</h3>

        <ul className="mt-3 w-full transition">
          {Object.entries(headerLists).map(([_, item]) => (
            <li
              className={`mb-8 flex items-center relative w-full pl-7 group hover:bg-red-500 py-4 cursor-pointer transition-all duration-200`}
              key={item.name}
              onClick={() => changeHeaderIsActive(item.name)}
            >
              {item.isActive && (
                <span className="transition-all duration-200 absolute right-0 h-8 border-r-[5px] border-red-500 group-hover:border-red-300 rounded-l-full"></span>
              )}
              <Link href={item.href}>
                <a className="flex items-center ">
                  <div className="mr-5">
                    <item.Icon
                      className={`w-5 h-5 transition-all duration-150 ${
                        item.isActive
                          ? "text-red-500 group-hover:text-red-100"
                          : "text-gray-300 group-hover:text-gray-100"
                      }`}
                    />
                  </div>
                  <h5
                    className={`transition duration-150 ${
                      item.isActive
                        ? "text-white"
                        : "text-gray-300 group-hover:text-gray-100"
                    }`}
                  >
                    {item.name}
                  </h5>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
