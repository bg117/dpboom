import { useState, useCallback, useEffect } from 'react';

export function useCopyToClipboard() {
    const [hasCopied, setHasCopied] = useState(false);
    const copy = useCallback((text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => setHasCopied(true))
            .catch(() => setHasCopied(false));
    }, []);

    useEffect(() => {
        if (hasCopied) {
            const id = setTimeout(() => {
                setHasCopied(false);
            }, 1500);
            return () => {
                clearTimeout(id);
            };
        }
    }, [hasCopied]);
    return { hasCopied, copy };
}
