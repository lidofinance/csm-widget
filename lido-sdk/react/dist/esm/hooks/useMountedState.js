import { useRef, useState, useEffect, useCallback } from 'react';

const useMountedState = (initialState) => {
    const mountedRef = useRef(false);
    const [state, setState] = useState(initialState);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    useEffect(() => {
        setState(initialState);
    }, [initialState]);
    const setMountedState = useCallback((...args) => {
        if (!mountedRef.current)
            return;
        setState(...args);
    }, []);
    return [state, setMountedState];
};

export { useMountedState };
