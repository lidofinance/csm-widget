import { BigNumberish } from '@ethersproject/bignumber';
import { SWRResponse } from './useLidoSWR';
export declare const useTxPrice: (gasLimit: BigNumberish) => Omit<SWRResponse<number>, 'mutate'>;
