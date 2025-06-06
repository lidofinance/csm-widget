export declare class BusRegistry<TModules extends object = object, TNames extends keyof TModules = keyof TModules> {
    private sdks;
    register<T extends TNames>(sdk: TModules[T], name: T): void;
    get<T extends TNames>(name: T): TModules[T] | undefined;
    getOrThrow<T extends TNames>(name: T): TModules[T];
}
//# sourceMappingURL=bus-registry.d.ts.map