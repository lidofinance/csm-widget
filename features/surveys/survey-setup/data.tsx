import { BigNumber } from 'ethers';

export type SetupData = {
  id?: number;
  keysCount: number;
  dvt: string;
  installationTool: string;
  elClient: string;
  clClient: string;
  clinetsServerType: string;
  clientsCountry: string;
  validatorClient: string;
  validatorServerType: string;
  validatorCountry: string;
  clAsValidator?: boolean;
  remoteSigner: string;
  mevMinBid?: BigNumber;
};

export type SetupRawData = Omit<SetupData, 'mevMinBid'> & {
  mevMinBid?: string;
};
export const transformToRaw = (data: SetupData): SetupRawData => ({
  ...data,
  mevMinBid: data.mevMinBid?.toString(),
});
export const transformFromRaw = (data: SetupRawData): SetupData => ({
  ...data,
  mevMinBid: BigNumber.from(data.mevMinBid),
  clAsValidator: data.clAsValidator ?? false,
});
