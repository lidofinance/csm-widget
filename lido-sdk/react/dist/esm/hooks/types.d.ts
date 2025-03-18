export declare type FilterAsyncMethods<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];
export declare type UnpackedPromise<T> = T extends Promise<infer U> ? U : T;
