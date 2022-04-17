
import { APIResponse, CommandBoxData, Movie } from "../types";
import { API } from './';

export async function searchMovies(keyword: string): Promise<Array<CommandBoxData> | null> {
    try {

        const { data: { data, error }, statusText } = await API.get(`/movie/search?q=${keyword}`);
        if (error) {
            console.log({ error, msg: statusText })
            return null
        }

        return data

    } catch (error: any) {
        console.log({ error: error.message })
        return null
    }
}

export async function getNextMovies(nextURL: string): Promise<APIResponse<Array<Movie>> | null> {
    try {

        const { data: { error }, statusText, data } = await API.get(nextURL);
        if (error) {
            console.log({ error, msg: statusText })
            return null
        }

        return data

    } catch (error: any) {
        console.log({ error: error.message })
        return null
    }
}