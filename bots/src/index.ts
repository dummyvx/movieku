
import { readFileSync, writeFileSync } from 'fs';
import { Movie, Series } from './types';

import dummy from './dummy';

function addData<T>(data: T, path: string): void {
    const existedData = readFileSync(path).toString() ? JSON.parse(readFileSync(path).toString()) : []
    if (existedData.length) {
        writeFileSync(path, JSON.stringify([...existedData, data]));
    } else {
        writeFileSync(path, JSON.stringify([data]));
    }
}

function readDataFromFile<T>(path: string): T {
    return JSON.parse(readFileSync(path).toString());
}

function cleanDuplicateData<T extends { _id: Movie['_id'], slug: string, title: string }>(data: Array<T>, path: string): void {
    const cleanDuplicate = [...new Map(data.map(v => [v.slug, v])).values()];

    console.log("Add Sorter property");
    const addSorterProperty = cleanDuplicate.map((value) => {
        const sorter = Date.now();
        return { ...value, sorter }
    })

    console.log("Storing data!");
    let start = 1;
    for (const each of addSorterProperty) {
        console.log(`${start}. ${each.title}`);
        addData(each, path);
        start++
    }

    console.log(`Stored at ${path}`);

}

// cleanDuplicateData(dummy, "./clean/dummy.json");

cleanDuplicateData(readDataFromFile<Array<Movie>>("./data/movies.json"), "./clean/movies.json");
cleanDuplicateData(readDataFromFile<Array<Series>>("./data/series.json"), "./clean/series.json");

process.exit(0);