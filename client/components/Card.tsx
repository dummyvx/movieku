import Image from "next/image";
import { FireIcon } from "@heroicons/react/solid";
import { FunctionComponent } from "react";

interface ICardComponent {
  imageURL: string;
  cardLabel: string;
  rating: string;
}

const CardComponent: FunctionComponent<ICardComponent> = (props) => {
  const { imageURL, cardLabel, rating } = props;

  const starRaw =
    rating.split(".")[0]!?.length > 1
      ? Number(rating.split(".")[0].split("").join("."))
      : Number(rating);

  const star = Math.round(starRaw / 2);
  const titleRaw = cardLabel.split("Film ")[1];
  const title = titleRaw.length < 30 ? titleRaw : `${titleRaw.slice(0, 30)}...`;

  return (
    <div className="rounded cursor-pointer transform transition-all group duration-100 hover:scale-105 relative">
      <div className="">
        <Image
          width={1080}
          height={1920}
          src={imageURL}
          objectFit="cover"
          loading="lazy"
          className="rounded-lg"
          alt={cardLabel}
        />
      </div>
      <div className="absolute w-6 md:w-8 bg-red-200/80 top-3 py-2 flex items-center flex-col space-y-2 rounded-r-xl opacity-90">
        {Array(star)
          .fill("_")
          .map((_, index) => (
            <FireIcon
              key={index}
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
            />
          ))}
      </div>

      <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center py-[2px] bg-red-600/80 px-3 md:px-4 rounded-full">
        <span className="text-gray-200 font-bold text-[10px] md:text-[12px] font-poppins">
          {starRaw}
        </span>
      </div>

      <h3 className="text-sm md:text-[13px] lg:text-[14px] text-gray-300 font-poppins mt-3 h-16 md:h-12 duration-150 transition group-hover:text-gray-50 group-hover:font-medium">
        {title}
      </h3>
    </div>
  );
};

export default CardComponent;
