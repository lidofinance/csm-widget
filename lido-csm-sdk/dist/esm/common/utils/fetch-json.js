export const fetchJson = async (url, params, parser) => {
    const response = await fetch(url, {
        method: 'GET',
        ...params,
    });
    if (!response.ok) {
        // TODO: throw error ???
        return undefined;
    }
    if (parser) {
        const text = await response.text();
        return parser(text);
    }
    return response.json();
};
export const fetchWithFallback = async (urls, fetcher) => {
    for (const url of urls) {
        if (!url)
            continue;
        try {
            const result = await fetcher(url);
            if (result)
                return result;
        }
        catch {
            /* noop */
        }
    }
};
//# sourceMappingURL=fetch-json.js.map