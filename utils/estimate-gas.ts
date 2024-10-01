import { StaticJsonRpcBatchProvider } from '@lidofinance/eth-providers';
import { PopulatedTransaction } from 'ethers';
import { trackMatomoError } from './track-matomo-event';

export class EstimateGasError extends Error {
  reason?: string;
  constructor(message: string, reason?: string) {
    super(message);
    this.reason = reason;
  }
}

export const estimateGas = async (
  tx: PopulatedTransaction,
  provider: StaticJsonRpcBatchProvider,
) => {
  try {
    return await provider.estimateGas(tx);
  } catch (error) {
    // retry without fees to see if just fails
    const result = await provider
      .estimateGas({
        ...tx,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined,
      })
      .catch(() => null);

    trackMatomoError(`${error}`, 'estimate_gas_error');

    // rethrow original not enough ether error
    if (result) {
      throw error;
    }

    throw new EstimateGasError(
      'Estimate gas went wrong',
      (error as any).reason,
    );
  }
};
