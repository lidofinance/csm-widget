export const CSM_CREATE_STEPS = {
  acknowledgement: 'Acknowledgement',
  choose: 'Choose operator type',
  upload: 'Upload keys',
  create: 'Create Node Operator',
} as const;

export type CsmCreateStage = 'choose' | 'upload';

export type CsmCreateSteps = { steps: string[]; current: number };

export const getCsmCreateSteps = (
  stage: CsmCreateStage,
  hasChoose: boolean,
): CsmCreateSteps => {
  const withChoose = hasChoose || stage === 'choose';
  const steps: string[] = [
    CSM_CREATE_STEPS.acknowledgement,
    ...(withChoose ? [CSM_CREATE_STEPS.choose] : []),
    CSM_CREATE_STEPS.upload,
    CSM_CREATE_STEPS.create,
  ];
  const currentLabel =
    stage === 'choose' ? CSM_CREATE_STEPS.choose : CSM_CREATE_STEPS.upload;

  return { steps, current: steps.indexOf(currentLabel) };
};
