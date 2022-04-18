import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { ToastInfoType } from '../components/Toast';

export type BookmarksType = Array<string>
type BookmarkReturn = | {
    error: true;
    msg: string;
} | {
    error: false;
    success: string
}

type CheckBookmarkType = | {
    existed: true;
    slug: string
} | {
    existed: false;
}

type UseBookmarksType = {
    slug: string;
    toastState: [toastInfo: ToastInfoType, setToastInfo: Dispatch<SetStateAction<ToastInfoType>>]
}

const useBookmarks = ({ slug, toastState }: UseBookmarksType) => {

    const [toastInfo, setToastInfo] = toastState
    const [onBookmark, setOnBookmark] = useState(false);

    const router = useRouter();

    const checkBookmark = useCallback((): CheckBookmarkType => {
        const bookmark = localStorage.getItem('bookmarks');
        let prevBookmarks: BookmarksType = bookmark ? JSON.parse(bookmark) : []

        const existedBookmark = prevBookmarks.find((item) => item.toString() === slug.toString());
        if (existedBookmark) {
            setOnBookmark(true);
            return {
                existed: true,
                slug: existedBookmark
            }
        }

        setOnBookmark(false);
        return {
            existed: false
        }
    }, [slug]);

    const addBookmark = (): void => {
        const bookmark = localStorage.getItem('bookmarks');
        let prevBookmarks: BookmarksType = bookmark ? JSON.parse(bookmark) : []

        const existedBookmark = checkBookmark();
        if (existedBookmark.existed) {
            const updatedBookmark = prevBookmarks.filter((item) => item.toString() !== existedBookmark.slug.toString());
            prevBookmarks = updatedBookmark
        }

        const newBookmarks = [...prevBookmarks, slug];
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        setOnBookmark(true);

        return;
    }

    const removeBookmark = (): BookmarkReturn => {
        const bookmark = localStorage.getItem('bookmarks');
        const prevBookmarks: BookmarksType = bookmark ? JSON.parse(bookmark) : []

        if (!prevBookmarks.length) {
            return {
                error: true,
                msg: "You don't have any bookmarks!"
            }
        }

        const newBookmarks = prevBookmarks.filter((bookmark) => bookmark.toString() !== slug.toString());
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        setOnBookmark(false);

        return {
            error: false,
            success: `Bookmark removed!`
        }
    }

    const toogleBookmark = (title: string, addToast: () => void, removeToast: () => void): void => {
        if (!onBookmark) {
            addBookmark();
            if (toastInfo["bookmarks"].status) {
                setToastInfo((prev) => ({
                    ...prev,
                    ["bookmarks"]: {
                        status: false,
                        type: toastInfo["bookmarks"].type,
                    },
                }));
            }

            addToast();
            return;
        }

        const status = removeBookmark();
        if (status.error) {
            setToastInfo((prev) => ({
                ...prev,
                ["bookmarks"]: {
                    status: true,
                    label: "[Failed]",
                    msg: status.msg,
                    type: "info",
                },
            }));
            return;
        }

        removeToast();
    };

    const onToastClose = useCallback(() => {
        setToastInfo((prev) => ({
            ...prev,
            ["bookmarks"]: { ...prev["bookmarks"], status: false },
        }));
        return;
    }, [setToastInfo]);

    useEffect(() => {
        const bookmark = localStorage.getItem('bookmarks');
        let prevBookmarks: BookmarksType = bookmark ? JSON.parse(bookmark) : []

        const status = Boolean(prevBookmarks.length && prevBookmarks.find((item) => item === slug));
        setOnBookmark(status);
    }, [router.asPath, slug])

    return {
        checkBookmark, addBookmark, removeBookmark, onBookmark, toogleBookmark, onToastClose
    }

}

export {
    useBookmarks
}