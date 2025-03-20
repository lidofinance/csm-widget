import { useRef, useCallback, useEffect } from 'react';

const useDebounceCallback = (callback, timeout = 0) => {
    const timer = useRef(null);
    const clearTimer = useCallback(() => {
        if (timer.current != null) {
            clearTimeout(timer.current);
        }
    }, []);
    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);
    return useCallback(() => {
        clearTimer();
        timer.current = setTimeout(callback, timeout);
    }, [callback, timeout, clearTimer]);
};

export { useDebounceCallback };
