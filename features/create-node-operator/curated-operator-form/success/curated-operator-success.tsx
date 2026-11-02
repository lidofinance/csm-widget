import {
  Body,
  Button,
  Description,
  H3,
  IconBox,
  IconDashboard,
  IconKeyRound,
  MessageBox,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import type { OperatorRef } from 'modules/web3';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { SuccessScreen } from 'shared/form-page';
import { useNavigate } from 'shared/navigate';
import { useSwitchOperator } from 'shared/node-operator';
import { useDisconnectWallet } from 'shared/wallet';
import { trackMatomoEvent } from 'utils';
import type { CuratedOperatorCreated } from '../context/curated-operator-created';
import { useCuratedOperatorCreated } from '../context/curated-operator-created-context';
import {
  CuratedNextStep,
  CuratedNextStepId,
  getCuratedNextSteps,
  getCustomAddressesNotice,
} from './success-content';
import {
  NextStepIconStyle,
  NextStepRowStyle,
  NextStepsStyle,
  NextStepTextStyle,
} from './styles';

const NEXT_STEP_ICONS: Record<CuratedNextStepId, typeof IconKeyRound> = {
  keys: IconKeyRound,
  bond: IconBox,
  dashboard: IconDashboard,
};

type NextStepRowProps = {
  step: CuratedNextStep;
  operator: OperatorRef;
  primary: boolean;
};

const NextStepRow: FC<NextStepRowProps> = ({ step, operator, primary }) => {
  const switchTo = useSwitchOperator(step.path);
  const Icon = NEXT_STEP_ICONS[step.id];

  return (
    <NextStepRowStyle data-testid={`nextStep-${step.id}`}>
      <NextStepIconStyle aria-hidden="true">
        <Icon />
      </NextStepIconStyle>
      <NextStepTextStyle>
        <Body as="p" weight="semibold">
          {step.title}
        </Body>
        <Description as="p">{step.description}</Description>
      </NextStepTextStyle>
      <Button
        size="small"
        variant={primary ? 'primary' : 'outline'}
        onClick={() => switchTo(operator)}
      >
        {step.action}
      </Button>
    </NextStepRowStyle>
  );
};

const CuratedNextSteps: FC<{
  operator: OperatorRef;
  hasManagerRole: boolean;
}> = ({ operator, hasManagerRole }) => (
  <NextStepsStyle>
    <H3 as="h2">Next Steps</H3>
    {getCuratedNextSteps(hasManagerRole).map((step, index) => (
      <NextStepRow
        key={step.id}
        step={step}
        operator={operator}
        primary={index === 0}
      />
    ))}
  </NextStepsStyle>
);

const CreateAnotherButton: FC = () => {
  const n = useNavigate();
  const { reset } = useFormContext();
  const { clearCreated } = useCuratedOperatorCreated();

  // PATH.CREATE resolves back to /create/cm for a CM-only wallet; same route keeps this page mounted
  const handleClick = async () => {
    await n(PATH.CREATE);
    reset();
    clearCreated();
  };

  return (
    <Button size="small" variant="outline" onClick={() => void handleClick()}>
      Create another Node Operator
    </Button>
  );
};

const DisconnectButton: FC = () => {
  const disconnect = useDisconnectWallet();

  const handleClick = () => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.disconnectWallet);
    disconnect();
  };

  return (
    <Button size="small" data-testid="disconnectBtn" onClick={handleClick}>
      Disconnect wallet
    </Button>
  );
};

export const CuratedOperatorSuccess: FC<{
  created: CuratedOperatorCreated;
}> = ({
  created: { operator, hasRole, hasManagerRole, availableGatesCount },
}) => {
  const showCreateAnother = availableGatesCount > 1;
  const createAnother = showCreateAnother ? <CreateAnotherButton /> : null;

  return (
    <SuccessScreen
      title="Congratulations!"
      description="Your Node Operator is set up and ready. You can now monitor your keys, track activity, and start earning rewards."
      notice={
        hasRole ? undefined : (
          <MessageBox
            variant="warning"
            headline="You have created a Node Operator with custom addresses"
          >
            {getCustomAddressesNotice(showCreateAnother)}
          </MessageBox>
        )
      }
      next={
        hasRole ? (
          <CuratedNextSteps
            operator={operator}
            hasManagerRole={hasManagerRole}
          />
        ) : undefined
      }
      actions={
        hasRole ? (
          createAnother
        ) : (
          <>
            <DisconnectButton />
            {createAnother}
          </>
        )
      }
    />
  );
};
