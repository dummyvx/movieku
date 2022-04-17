import { useMemo, useState } from 'react';

import { Series } from "../types";

const useOneSeriesPageLogic = (series: Series) => {

    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const clearTitle = series.title.split(' Episode')[0]
    const year = clearTitle
        .slice(clearTitle.length - 6, clearTitle.length)
        .split("(")
        .join("")
        .split(")")[0];

    const title = series.title.split("Film ")[1];

    let duration: string = series.duration.split(" min")[0];
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

export { useOneSeriesPageLogic };