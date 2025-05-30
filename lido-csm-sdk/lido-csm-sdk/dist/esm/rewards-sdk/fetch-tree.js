const prepare = (text) => {
    return text.replace(/"value"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/gm, '"value":["$1","$2"]');
};
export const fetchTree = async (url, params) => {
    const response = await fetch(url, {
        method: 'GET',
        ...params,
    });
    if (!response.ok) {
        // TODO: throw error ???
        return undefined;
    }
    const text = await response.text();
    return JSON.parse(prepare(text));
};
//# sourceMappingURL=fetch-tree.js.map