import type { CreatableOperatorType, CreateOption } from './use-create-options';

export type CreateFlow = {
  showAck: boolean;
  willChoose: boolean;
  directType: CreatableOperatorType | undefined;
};

/** Ack only when a CSM-family operator can actually be created; a lone create option skips Choose. */
export const getCreateFlow = (options: CreateOption[]): CreateFlow => {
  const only = options.length === 1 ? options[0] : undefined;
  const directType = only?.kind === 'create' ? only.type : undefined;

  return {
    showAck: options.some(({ kind }) => kind === 'create'),
    willChoose: !directType,
    directType,
  };
};
