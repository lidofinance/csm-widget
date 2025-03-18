'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

const useMountedState = (initialState) => {
    const mountedRef = react.useRef(false);
    const [state, setState] = react.useState(initialState);
    react.useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    react.useEffect(() => {
        setState(initialState);
    }, [initialState]);
    const setMountedState = react.useCallback((...args) => {
        if (!mountedRef.current)
            return;
        setState(...args);
    }, []);
    return [state, setMountedState];
};

exports.useMountedState = useMountedState;
