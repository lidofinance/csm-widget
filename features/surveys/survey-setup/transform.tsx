import { BigNumber } from 'ethers';
import { Setup, SetupRaw } from '../types';

export const transformOutcoming = (data: Setup): SetupRaw => ({
  ...data,
  mevMinBid: data.mevMinBid?.toString(),
  validatorClient: data.validatorSameAsCl ? '' : data.validatorClient,
  validatorServerType: data.validatorSameAsCl ? '' : data.validatorServerType,
  validatorCountry: data.validatorSameAsCl ? '' : data.validatorCountry,
});
export const transformIncoming = (data: SetupRaw): Setup => ({
  ...data,
  mevMinBid: BigNumber.from(data.mevMinBid),
  validatorSameAsCl: data.validatorSameAsCl ?? false,
});
