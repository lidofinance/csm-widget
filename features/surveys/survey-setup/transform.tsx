import { Setup, SetupRaw } from '../types';

export const transformOutcoming = (data: Setup): SetupRaw => ({
  ...data,
  mevMinBid: data.mevMinBid?.toString() || null,
  validatorClient: data.validatorSameAsCl ? '' : data.validatorClient,
  validatorServerType: data.validatorSameAsCl ? '' : data.validatorServerType,
  validatorCountry: data.validatorSameAsCl ? '' : data.validatorCountry,
});
export const transformIncoming = (data: SetupRaw): Setup => ({
  ...data,
  mevMinBid: data.mevMinBid ? BigInt(data.mevMinBid) : undefined,
  validatorSameAsCl: data.validatorSameAsCl ?? false,
});
