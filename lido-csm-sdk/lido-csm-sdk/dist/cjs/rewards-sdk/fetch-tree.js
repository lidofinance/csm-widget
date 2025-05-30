"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTree = void 0;
const prepare = (text) => {
    return text.replace(/"value"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/gm, '"value":["$1","$2"]');
};
const fetchTree = async (url, params) => {
    const response = await fetch(url, {
        method: 'GET',
        ...params,
    });
    if (!response.ok) {
        return undefined;
    }
    const text = await response.text();
    return JSON.parse(prepare(text));
};
exports.fetchTree = fetchTree;
//# sourceMappingURL=fetch-tree.js.map