import type { WizardStep } from 'shared/form-page/use-form-wizard';
import type { CuratedOperatorFormInputType } from './context/types';

export const CURATED_OPERATOR_STEPS: WizardStep<CuratedOperatorFormInputType>[] =
  [
    { label: 'Choose type', fields: ['gateName'] },
    { label: 'Specify addresses', fields: ['managerAddress', 'rewardAddress'] },
    { label: 'Set name', fields: ['name', 'description'] },
    { label: 'Create Node Operator', fields: [] },
  ];

export const CURATED_OPERATOR_STEP_LABELS = CURATED_OPERATOR_STEPS.map(
  ({ label }) => label,
);

export type CuratedOperatorStepHeading = {
  title: string;
  description?: string;
  note?: string;
};

const HEADINGS: CuratedOperatorStepHeading[] = [
  {
    title: 'Select Sub-Node Operator Type',
    description:
      'Choose the type you want to create now. You can create additional Sub-Node Operators with other types later',
  },
  {
    title: 'Specify addresses',
    description:
      'Manager Address will have the ultimate control over the Node Operator, while Rewards Address is mainly used to receive rewards',
    note: 'Rewards Address cannot reset the Manager Address. Manager Address can change the Rewards Address.',
  },
  { title: 'Set Node Operator name and description' },
  { title: 'Confirm Node Operator creation' },
];

export const getStepHeading = (step: number) => HEADINGS[step] ?? HEADINGS[0];

export const isStepComplete = (values: unknown[], hasError: boolean) =>
  !hasError && values.every((value) => value !== undefined && value !== '');

export const getGateCardTestId = (short: string) =>
  `gateCard${short.replace(/\+/g, 'Plus')}`;

export const isRepeatClick = (detail: number) => detail > 1;
