import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Body, Card, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { FC, ReactNode } from 'react';
import { MatomoLink } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';

type Props = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
};

type Step = { title: string; description: ReactNode };

const GridStyle = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 48px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 899px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const StepStyle = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 0;
  border-top: 1px solid var(--lido-app-ui-color-border-default);

  &:nth-child(odd) {
    margin-right: -24px;
    padding-right: 24px;
  }

  &:nth-child(even) {
    margin-left: -24px;
    padding-left: 24px;
  }

  &:nth-child(-n + 2) {
    border-top: 0;
    padding-top: 0;
  }

  &:nth-last-child(-n + 2) {
    padding-bottom: 0;
  }

  @media (max-width: 899px) {
    &:nth-child(odd),
    &:nth-child(even) {
      margin: 0;
      padding-right: 0;
      padding-left: 0;
    }

    &:nth-child(2) {
      border-top: 1px solid var(--lido-app-ui-color-border-default);
      padding-top: 24px;
    }

    &:nth-last-child(2) {
      padding-bottom: 24px;
    }
  }
`;

const NumberStyle = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--lido-app-ui-color-tint-active);
  color: var(--lido-app-ui-color-text-active);
  font-size: 24px;
  font-weight: 500;
`;

const TextStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

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
      <GridStyle>
        {STEPS[type].map(({ title, description }, index) => (
          <StepStyle key={title}>
            <NumberStyle aria-hidden>{index + 1}</NumberStyle>
            <TextStyle>
              <Body weight="semibold">{title}</Body>
              <Body color="secondary">{description}</Body>
            </TextStyle>
          </StepStyle>
        ))}
      </GridStyle>
    </Stack>
  </Card>
);
