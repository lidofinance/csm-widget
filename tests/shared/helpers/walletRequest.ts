import { WalletPage } from '@lidofinance/wallets-testing-wallets';

type PendingRequest = unknown;

type WithRequestManager = {
  requestManager: {
    getCurrentRequest(): Promise<PendingRequest>;
    getRequestInfo(request: PendingRequest): { method: string };
  };
};

// requestManager is private in WCWallet; it waits for the next request if none is pending
export const getPendingRequestMethod = async (walletPage: WalletPage) => {
  const { requestManager } = walletPage as unknown as WithRequestManager;
  const request = await requestManager.getCurrentRequest();
  return requestManager.getRequestInfo(request).method;
};
