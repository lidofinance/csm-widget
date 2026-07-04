import type { IcsScoresDto } from 'modules/surveys-sdk/generated';

export type {
  IcsFormStatus,
  IcsFormDataDto,
  IcsCommentsDto,
  IcsScoresDto,
  IcsResponseDto,
  IcsAdditionalAddressDto,
  IcsApplyDto,
} from 'modules/surveys-sdk/generated';

export type IcsScoresItem = keyof IcsScoresDto;
