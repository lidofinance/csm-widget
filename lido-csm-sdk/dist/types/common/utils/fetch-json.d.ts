type Fetcher = <T>(url: string, params?: RequestInit, parser?: (text: string) => T) => Promise<T>;
export declare const fetchJson: Fetcher;
export declare const fetchWithFallback: <T>(urls: Array<string | null>, fetcher: (url: string) => Promise<T | null>) => Promise<NonNullable<Awaited<T>> | void>;
export {};
//# sourceMappingURL=fetch-json.d.ts.map