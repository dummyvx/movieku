import { SVGProps } from "react";

export type HeaderNames = "Home" | "Movies" | "Series" | "BluRay" | "Ongoing" | "Complete" | "Bookmarks";
export type HeaderInitValue = Record<
    HeaderNames,
    {
        name: HeaderNames;
        Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
        isActive: boolean;
        href: string;
    }
>;

type MovieLink = {
    quality: string;
    links: Array<{ provider: string; src: string; }>
}

export type Movie = {
    slug: string;
    title: string;
    genres: Array<string>
    release: string;
    stars: Array<string>;
    duration: string;
    director: string;
    country: string;
    quality: string;
    poster: string;
    rating: string;
    trailer: string | undefined;
    synopsis: string;
    status: undefined;

    links: Array<MovieLink>
}

type SeriesLink = {
    episode: string;
    links: Array<{ quality: string; links: Array<{ provider: string; src: string }> }>
}

export type Series = {
    slug: string;
    title: string;
    genres: Array<string>
    status: string;
    release: string | undefined;
    stars: Array<string>;
    duration: string;
    country: string;
    poster: string;
    rating: string;
    trailer: string | undefined;
    director: string | undefined;
    synopsis: string;

    links: Array<SeriesLink>
}

export type InfoReponse = {
    page: number;
    nextURL: string;
    allPage: number;
}

export type APIResponse<T> = {
    info: InfoReponse,
    data: T
}

export type CommandBoxData = {
    slug: string;
    title: string;
    poster: string;
    rating: string;
    duration: string;
    status?: string;
}