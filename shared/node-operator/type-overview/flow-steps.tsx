import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Body, Card, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { FC, ReactNode } from 'react';
import { MatomoLink } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import s from './flow-steps.module.css';

type Props = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
};

type Step = { title: string; description: ReactNode };

const SHARED_STEPS: Step[] = [
  {
    title: 'Operator type issuance',
    description:
      'If approved, the CSM Committee will initiate an Easy Track motion to assign the operator type to the applicant’s address',
  },
  {
    title: 'Operator type claim',
    description:
      'Once the operator type is issued, it can be claimed via the CSM UI (for existing operators), or it will be assigned automatically upon operator creation (for new operators)',
  },
];

const ApplicationFormLink: FC<{ href: PATH }> = ({ href }) => (
  <>
    “<LocalLink href={href}>Application form</LocalLink>” sub-tab
  </>
);

const STEPS: Record<Props['type'], Step[]> = {
  [OPERATOR_TYPE.CSM_ICS]: [
    {
      title: 'Application submission',
      description: (
        <>
          People interested in being included in{' '}
          <MatomoLink
            $inline
            href="https://github.com/lidofinance/community-staking-module/blob/develop/artifacts/mainnet/ics/addresses.json"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.icsGithubAddressesLink}
          >
            the Identified Community Staker list
          </MatomoLink>{' '}
          must submit an application on the{' '}
          <ApplicationFormLink href={PATH.TYPE_ICS_APPLY} />
        </>
      ),
    },
    {
      title: 'Application review',
      description:
        'After submission, the application undergoes semi-automated checks to validate the provided information and assign the appropriate scores',
    },
    ...SHARED_STEPS,
  ],
  [OPERATOR_TYPE.CSM_IDVTC]: [
    {
      title: 'Application submission',
      description: (
        <>
          People interested in being included in the Identified DVT Cluster list
          must submit an application on the{' '}
          <ApplicationFormLink href={PATH.TYPE_IDVTC_APPLY} />
        </>
      ),
    },
    {
      title: 'Application review',
      description:
        'After submission, the application undergoes semi-automated checks to validate the provided information',
    },
    ...SHARED_STEPS,
  ],
};

export const FlowSteps: FC<Props> = ({ type }) => (
  <Card dataTestId={{ root: 'typeFlowSteps' }}>
    <Stack direction="column" gap={24}>
      <SectionTitle title="Application Flow" />
      <ol className={s.grid}>
        {STEPS[type].map(({ title, description }, index) => (
          <li key={title} className={s.step}>
            <span className={s.number} aria-hidden>
              {index + 1}
            </span>
            <Stack gap={4} className={s.text}>
              <Body weight="semibold">{title}</Body>
              <Body color="secondary">{description}</Body>
            </Stack>
          </li>
        ))}
      </ol>
    </Stack>
  </Card>
);
