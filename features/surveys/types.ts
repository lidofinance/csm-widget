import type {
  ContactDto,
  DelegateResponseDto,
  DelegatesListResponseDto,
  ExperienceDto,
  HowDidYouLearnCsmDto,
  KeysDto,
  MyDelegationsDto,
  SetupResponseDto,
} from 'modules/surveys-sdk/generated';

// These alias the REQUEST DTOs — the shapes the survey forms submit. The GET
// responses are the matching `*ResponseDto` supersets (extra createdAt/updatedAt);
// the read transforms only touch the shared fields, so the extra ones are ignored.
export type Contact = ContactDto;

export type Experience = ExperienceDto;

export type HowDidYouLearnCsm = HowDidYouLearnCsmDto;

// `left` (keys not yet assigned to a setup) is a client-side derivation:
// the wire `KeysDto` only carries `{ filled, total }`. Computed at the
// `setups/keys` call sites via `transformIncoming`.
export type SetupsKeys = KeysDto & {
  left: number;
};

// Domain (form-facing) shape: `mevMinBidWei` is a bigint in the form,
// serialized to/from the wire string by survey-setup/transform.
export type Setup = Omit<SetupResponseDto, 'mevMinBidWei'> & {
  mevMinBidWei?: bigint;
};

// Wire shape the setup transforms map to/from. Mirrors SetupResponseDto, but
// `mevMinBidWei` is nullable: sending an explicit `null` is how the API CLEARS a
// previously-set MEV bid. The generated request body (SetupDto) models the field
// as optional-string-only, so we widen here and bridge that single-field gap with
// a cast at the request boundary (see useOperatorSetup).
export type SetupRaw = Omit<SetupResponseDto, 'mevMinBidWei'> & {
  mevMinBidWei?: string | null;
};

export type Delegate = DelegateResponseDto;

export type DelegatesResponse = DelegatesListResponseDto;

export const MAX_DELEGATES = 5;

export type DelegatedOperatorsResponse = MyDelegationsDto;
