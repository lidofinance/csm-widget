export type CleanQueueFormInputType = Record<string, never>;

export type CleanQueueFormNetworkData = {
  loading: {
    isEthBalanceLoading: boolean;
  };
  ethBalance: bigint | undefined;
};
