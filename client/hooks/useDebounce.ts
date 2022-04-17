
import { useEffect, useState } from 'react';


const useDebounce = (query: string, delay: number) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setValue(query), delay);
        return () => clearTimeout(timeout);
    }, [delay, query])

    return value
}

export default useDebounce