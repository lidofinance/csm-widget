import { CSM_CREATE_STEPS, getCsmCreateSteps } from './csm-create-steps';

const ALL = [
  CSM_CREATE_STEPS.acknowledgement,
  CSM_CREATE_STEPS.choose,
  CSM_CREATE_STEPS.upload,
  CSM_CREATE_STEPS.create,
];

describe('getCsmCreateSteps', () => {
  it('marks Choose as current on the type selection page', () => {
    expect(getCsmCreateSteps('choose', true)).toEqual({
      steps: ALL,
      current: 1,
    });
  });

  it('marks Upload keys as current on the form with several types', () => {
    expect(getCsmCreateSteps('upload', true)).toEqual({
      steps: ALL,
      current: 2,
    });
  });

  it('hides Choose on the form when only one type is creatable', () => {
    expect(getCsmCreateSteps('upload', false)).toEqual({
      steps: [
        CSM_CREATE_STEPS.acknowledgement,
        CSM_CREATE_STEPS.upload,
        CSM_CREATE_STEPS.create,
      ],
      current: 1,
    });
  });

  it('never hides Choose on the type selection page', () => {
    expect(getCsmCreateSteps('choose', false)).toEqual({
      steps: ALL,
      current: 1,
    });
  });

  it('uses the Figma step labels', () => {
    expect(ALL).toEqual([
      'Acknowledgement',
      'Choose operator type',
      'Upload keys',
      'Create Node Operator',
    ]);
  });
});
