"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithFallback = exports.fetchJson = void 0;
const fetchJson = async (url, params, parser) => {
    const response = await fetch(url, {
        method: 'GET',
        ...params,
    });
    if (!response.ok) {
        return undefined;
    }
    if (parser) {
        const text = await response.text();
        return parser(text);
    }
    return response.json();
};
exports.fetchJson = fetchJson;
const fetchWithFallback = async (urls, fetcher) => {
    for (const url of urls) {
        if (!url)
            continue;
        try {
            const result = await fetcher(url);
            if (result)
                return result;
        }
        catch {
        }
    }
};
exports.fetchWithFallback = fetchWithFallback;
//# sourceMappingURL=fetch-json.js.map