import mongoose from "mongoose";

export type MovieLink = {
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
    sorter: number;

    links: Array<MovieLink>
}

const schema = new mongoose.Schema({

    slug: {
        required: true,
        type: String
    },

    title: {
        required: true,
        type: String
    },

    genres: {
        required: true,
        type: [String]
    },

    release: String,

    stars: {
        required: true,
        type: [String]
    },

    duration: {
        required: true,
        type: String
    },

    synopsis: String,

    poster: {
        required: true,
        type: String
    },

    trailer: String,

    rating: {
        required: true,
        type: String
    },

    links: {
        required: true,
        type: [{ quality: String, links: [{ provider: String, src: String }] }]
    },

    director: String,

    country: String,

    quality: String,

    sorter: Number

}, { timestamps: true })

schema.index({ 'title': 'text', release: 'text', country: 'text', 'quality': 'text', 'director': 'text', 'stars': 'text' }, { name: "title_index" });

const MovieModel = mongoose.model<Movie>('movie', schema);
export default MovieModel
