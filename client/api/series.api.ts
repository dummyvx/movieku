
import { APIResponse, CommandBoxData, Series } from "../types";
import { API } from '.';

export async function searchSeries(keyword: string): Promise<Array<CommandBoxData> | null> {
    try {

        const { data: { data, error }, statusText } = await API.get(`/series/search?q=${keyword}`);
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

export async function getNextSeries(nextURL: string): Promise<APIResponse<Array<Series>> | null> {
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