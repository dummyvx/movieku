export type MovieLink = {
    quality: string;
    links: Array<{ provider: string; src: string; }>
}

export type Movie = {
    _id: { '$oid': string };
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
    sorter: number;

    links: Array<MovieLink>

    createdAt: Date;
    updatedAt: Date;
}

export type SeriesLink = {
    episode: string;
    links: Array<{ quality: string; links: Array<{ provider: string; src: string }> }>
}

export type Series = {
    _id: { '$oid': string }
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
    sorter: number;

    links: Array<SeriesLink>;

    createdAt: Date;
    updatedAt: Date;
}