'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var warning = require('tiny-warning');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var warning__default = /*#__PURE__*/_interopDefaultLegacy(warning);

const useLocalStorage = (key, initialValue) => {
    const readValue = react.useCallback(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            warning__default["default"](typeof window === 'undefined', `Error reading localStorage key "${key}"`);
            return initialValue;
        }
    }, [initialValue, key]);
    const [storedValue, setStoredValue] = react.useState(readValue);
    const saveToStorage = react.useCallback((newValue) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
            window.dispatchEvent(new Event('local-storage'));
        }
        catch (error) {
            warning__default["default"](typeof window === 'undefined', `Error setting localStorage key "${key}"`);
        }
    }, [key]);
    const setValue = react.useCallback((value) => {
        if (value instanceof Function) {
            setStoredValue((current) => {
                const newValue = value(current);
                saveToStorage(newValue);
                return newValue;
            });
        }
        else {
            saveToStorage(value);
            setStoredValue(value);
        }
    }, [saveToStorage]);
    react.useEffect(() => {
        setStoredValue(readValue());
    }, [readValue]);
    react.useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue());
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [readValue]);
    return [storedValue, setValue];
};

exports.useLocalStorage = useLocalStorage;
