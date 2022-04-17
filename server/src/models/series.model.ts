import mongoose from "mongoose";

export type SeriesLink = {
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

    status: {
        required: true,
        type: String
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

    synopsis: {
        type: String,
        required: true
    },

    poster: {
        required: true,
        type: String
    },

    rating: {
        required: true,
        type: String
    },

    links: {
        required: true,
        type: [{ episode: String, links: [{ quality: String, links: [{ provider: String, src: String }] }] }]
    },

    country: String,

    director: String,

    trailer: String

}, { timestamps: true })

schema.index({ 'title': "text" }, { name: "title_text_index" });

const SeriesModel = mongoose.model<Series>('serie', schema);
export default SeriesModel
