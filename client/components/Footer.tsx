import Link from "next/link";
import { Fragment, FunctionComponent } from "react";

const Footer: FunctionComponent = () => {
  return (
    <Fragment>
      <footer
        id="footer"
        className="flex items-center flex-col lg:flex-row justify-center lg:justify-between py-8 w-full"
      >
        <div className="inline-flex space-x-5 font-poppins mb-5 lg:mb-0">
          <Link href="https://107.152.39.187/" passHref>
            <a
              target="_blank"
              className="text-xs md:text-sm text-gray-400 bg-gray-900 px-2 md:px-5 py-2 text-center my-auto rounded-md md:rounded-full font-medium hover:text-gray-100 hover:bg-indigo-500 duration-150 transition-all focus:bg-indigo-500 focus:text-white focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
            >
              Data Provider
            </a>
          </Link>
          <Link href="https://github.com/NovqiGarrix/movieku" passHref>
            <a
              target="_blank"
              className="text-xs md:text-sm text-gray-400 bg-gray-900 px-2 md:px-5 py-2 text-center my-auto rounded-md md:rounded-full font-medium hover:text-gray-100 hover:bg-indigo-500 duration-150 transition-all focus:bg-indigo-500 focus:text-white focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
            >
              Project available on Github
            </a>
          </Link>
        </div>

        <div>
          <span className="text-gray-300 text-sm font-poppins">
            Copyright © Movieku. All Rights Reserved
          </span>
        </div>

        <div>
          <Link href="https://github.com/NovqiGarrix/movieku" passHref>
            <a
              target="_blank"
              className="hidden lg:invisible text-sm text-gray-400 bg-gray-900 px-5 py-2 rounded-full font-medium hover:text-gray-100 hover:bg-indigo-500 duration-150 transition-all focus:bg-indigo-500 focus:text-white focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
            >
              Project available on Github
            </a>
          </Link>
          <span className="text-gray-400 text-sm font-poppins select-none font-medium italic">
            Created by NovqiGarrix
          </span>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
