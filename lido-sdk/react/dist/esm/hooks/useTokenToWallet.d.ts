export declare const useTokenToWallet: (address: string, image?: string | undefined) => {
    addToken?: (() => Promise<boolean>) | undefined;
    loading: boolean;
};
