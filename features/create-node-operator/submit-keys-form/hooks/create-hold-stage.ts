export type CreateHoldStage =
  'created-without-id' | 'dkg-upload' | 'members-init' | 'pending';

type CreateHoldStageInput = {
  hasResult: boolean;
  stagedFiles: number;
  willInitMembers: boolean;
};

export const getCreateHoldStage = ({
  hasResult,
  stagedFiles,
  willInitMembers,
}: CreateHoldStageInput): CreateHoldStage => {
  if (!hasResult) return 'created-without-id';
  if (stagedFiles > 0) return 'dkg-upload';
  if (willInitMembers) return 'members-init';
  return 'pending';
};
