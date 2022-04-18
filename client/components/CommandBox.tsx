import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/router";

import { Dialog, Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import { CommandBoxData } from "../types";
import { CommandBoxContext } from "../contexts/CommandBoxContext";

interface ICommandBox {
  data: Array<CommandBoxData>;
  setKeyword: Dispatch<SetStateAction<string>>;
  setSearchedData: Dispatch<SetStateAction<Array<CommandBoxData>>>;
  keyword: string;
  debounceValue: string;
  isLoading: boolean;
}

const CommandBox: FunctionComponent<ICommandBox> = (props) => {
  const {
    data,
    setKeyword,
    keyword,
    isLoading,
    debounceValue,
    setSearchedData,
  } = props;
  const [isOpen, setIsOpen] = useContext(CommandBoxContext);

  const router = useRouter();

  const onKeydown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === "/" && (ev.metaKey || ev.ctrlKey)) {
        setIsOpen((prev) => !prev);
        setKeyword("");
      }
    },
    [setIsOpen, setKeyword]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [onKeydown]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSearchedData([]);
        setKeyword("");
      }}
      className="inset-x-0 top-0 fixed z-10 p-5 pt-[25vh] overflow-y-auto"
      as="div"
    >
      <Dialog.Overlay className="bg-gray-800/75  fixed inset-0" />
      <Combobox
        onChange={(value: CommandBoxData) => {
          setIsOpen(false);
          setKeyword("");
          const getType = () => (value.status ? "series" : "movies");
          router.push(`/${getType()}/${value.slug}`);
        }}
        as="div"
        value={undefined}
        className="bg-gray-900 shadow rounded-xl max-w-2xl mx-auto relative py-4 font-poppins divide-y space-y-3 divide-gray-800"
      >
        <div className="flex items-center space-x-5 px-5">
          <SearchIcon className="w-6 h-6 text-gray-300" />
          <Combobox.Input
            value={keyword}
            onChange={(ev) => {
              setKeyword(ev.target.value);
            }}
            placeholder="Search..."
            className="w-full bg-transparent border-0 outline-none text-gray-300 placeholder:text-gray-400 font-medium text-base"
          />
        </div>

        {data.length > 0 && (
          <Combobox.Options
            static
            className="py-2 pt-4 overflow-y-auto text-base max-h-96 scrollbar-hide"
          >
            {data.map((item, index) => (
              <Combobox.Option
                key={index}
                className="text-gray-200 cursor-pointer"
                value={item}
              >
                {({ active }) => (
                  <div
                    className={`flex px-5 w-full items-center justify-between ${
                      active ? "bg-gray-800" : "bg-gray-900"
                    } `}
                  >
                    <h5
                      className={`py-3 font-poppins text-base ${
                        active
                          ? "text-gray-200 font-medium"
                          : "text-gray-300 font-light"
                      }`}
                    >
                      {item.title}
                    </h5>

                    <code className="px-2 py-1 bg-gray-500 rounded-full text-gray-800 font-medium text-xs font-poppins">
                      {item.duration}
                    </code>
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}

        {debounceValue && data.length < 1 && !isLoading && (
          <Combobox.Options
            static
            className="pt-4 overflow-y-auto text-base max-h-96 scrollbar-hide"
          >
            <span className="font-poppins text-sm px-5 text-gray-200 font-medium">
              Film not found
            </span>
          </Combobox.Options>
        )}
      </Combobox>
    </Dialog>
  );
};

export default CommandBox;
