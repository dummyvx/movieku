
import axios from "axios";
import { CommandBoxData, Movie, Series } from "../types";
import { searchMovies } from "./movies.api";
import { searchSeries } from "./series.api";


const SERVER_URL = process.env.SERVER_URL!;
export const API = axios.create({ baseURL: `${SERVER_URL}/api/v1` });

export async function search(keyword: string): Promise<Array<CommandBoxData> | null> {
    try {

        const movies = await searchMovies(keyword);
        const series = await searchSeries(keyword);

        if (!movies && !series) {
            console.log("No datas!");
            return null
        }

        return [...(movies ?? []), ...(series ?? [])];

    } catch (error: any) {
        console.log({ error: error.message })
        return null
    }
}

export async function getBookmarks(bookmarks: Array<string>): Promise<Array<CommandBoxData> | null> {
    try {

        let allData: Array<Movie & Series> = []
        let series: Array<string> = []

        for (const item of bookmarks) {
            const { data: { data } } = await API.get(`/movie/${item}/one`);
            if (data) {
                allData = [...allData, data]
            } else {
                series = [...series, item]
            }
        }

        if (series.length) {
            for (const item of series) {
                const { data: { data } } = await API.get(`/series/${item}/one`);
                if (data) allData = [...allData, data]
            }
        }

        const data: Array<CommandBoxData> = allData.map((item) => ({ duration: item.duration, poster: item.poster, rating: item.rating, slug: item.slug, title: item.title, status: item?.status }))
        return data

    } catch (error: any) {
        console.log({ error: error.message })
        return null
    }
}