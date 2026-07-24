import type { KeysDto } from 'modules/surveys-sdk/generated';
import { Setup, SetupRaw, SetupsKeys } from '../types';

// `left` = keys not yet assigned to a setup = total - filled (clamped ≥ 0).
// The wire `KeysDto` doesn't carry it, so derive it on the way in.
export const transformKeysIncoming = (data: KeysDto): SetupsKeys => ({
  ...data,
  left: Math.max(0, data.total - data.filled),
});

export const transformOutgoing = (data: Setup): SetupRaw => ({
  ...data,
  // Send an explicit `null` when unset so the API clears a previously-stored
  // bid; omitting the field would leave the old value in place.
  mevMinBidWei: data.mevMinBidWei?.toString() ?? null,
  validatorClient: data.validatorSameAsCl ? '' : data.validatorClient,
  validatorServerType: data.validatorSameAsCl ? '' : data.validatorServerType,
  validatorCountry: data.validatorSameAsCl ? '' : data.validatorCountry,
});

export const transformIncoming = (data: SetupRaw): Setup => ({
  ...data,
  mevMinBidWei: data.mevMinBidWei ? BigInt(data.mevMinBidWei) : undefined,
  validatorSameAsCl: data.validatorSameAsCl ?? false,
});
