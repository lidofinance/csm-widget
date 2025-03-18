'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

const useDebounceCallback = (callback, timeout = 0) => {
    const timer = react.useRef(null);
    const clearTimer = react.useCallback(() => {
        if (timer.current != null) {
            clearTimeout(timer.current);
        }
    }, []);
    react.useEffect(() => {
        return clearTimer;
    }, [clearTimer]);
    return react.useCallback(() => {
        clearTimer();
        timer.current = setTimeout(callback, timeout);
    }, [callback, timeout, clearTimer]);
};

exports.useDebounceCallback = useDebounceCallback;
