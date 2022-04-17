import { useMemo, useState } from 'react';

import { Movie } from "../types";

const useMoviePageLogic = (movie: Movie) => {

    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const year = movie.title
        .slice(movie.title.length - 6, movie.title.length)
        .split("(")
        .join("")
        .split(")")[0];

    const title = movie.title.split("Film ")[1];

    let duration: string = movie.duration.split(" min")[0];
    const dura = useMemo(() => {
        for (let index = 1; index <= 5; index++) {
            const durationNum = Number(duration);
            if (index < 2 && durationNum < 60) {
                duration = `${duration} min`;
                return duration;
            }

            const minute = durationNum - 60;
            if (minute < 60) {
                return `${index}h ${minute}m`;
            }
        }
    }, [duration]);

    const copyToClipboard = (): void => {
        const URL = document.URL.split('#')[0];

        navigator.clipboard.writeText(URL)
            .then(() => {
                setCopiedToClipboard(true);
                const interval = setInterval(() => {
                    setCopiedToClipboard(false)
                    clearInterval(interval);
                }, 1000 * 15);
            })
            .catch((err) => console.error({ from: "Copy to Clipboard", err: err.message }));
    }

    return {
        year, title, dura, copyToClipboard, copiedToClipboard
    }
}

export { useMoviePageLogic };