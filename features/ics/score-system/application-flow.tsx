import { Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { MatomoLink, Stack } from 'shared/components';
import { Number, StepContent, StepWrapper } from './styles';
import { LocalLink } from 'shared/navigate';
import { PATH } from 'consts/urls';

export const Step: FC<PropsWithChildren<{ number: string; title: string }>> = ({
  number,
  title,
  children,
}) => {
  return (
    <StepWrapper>
      <Number>{number}</Number>
      <StepContent>
        <h3>{title}</h3>
        <p>{children}</p>
      </StepContent>
    </StepWrapper>
  );
};

export const ApplicationFlow: FC = () => {
  return (
    <Stack direction="column" gap="md">
      <Text as="h3" size="lg" weight="bold">
        Application Flow
      </Text>
      <Step number="1" title="Application submission">
        People interested in being included in{' '}
        <MatomoLink href="https://github.com/lidofinance/community-staking-module/blob/develop/artifacts/mainnet/ics/addresses.json">
          the Identified Community Staker list
        </MatomoLink>{' '}
        must submit the application on the “
        <LocalLink href={PATH.TYPE_ICS_APPLY}>Application form</LocalLink>”
        sub-tab
      </Step>
      <Step number="2" title="Application review">
        After submission, the application undergoes semi-automated checks to
        validate the provided information and assign the appropriate scores
      </Step>
      <Step number="3" title="Operator type issuance">
        If approved, the CSM Committee will initiate an Easy Track motion to
        assign the operator type to the applicant’s address
      </Step>
      <Step number="4" title="Operator type claim">
        Once the operator type is issued, it can be claimed via the CSM UI (for
        existing operators), or it will be assigned automatically upon operator
        creation (for new operators)
      </Step>
    </Stack>
  );
};
