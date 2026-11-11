import {
  Button,
  IconAdjust,
  IconBox,
  IconKeyRound,
  IconLink,
  IconWallet,
} from '@lidofinance/lido-app-ui';
import {
  CSM_NODE_SETUP_LINK,
  HOW_TO_GENERATE_DEPOSIT_DATA_LINK,
  LIDO_OPERATOR_PORTAL_BONDS_INFO,
  PREPARE_HARDWARE_LINK,
} from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, ReactNode } from 'react';
import { HubList, HubRow } from 'shared/components/hub-list';
import styled from 'styled-components';
import { trackMatomoEvent } from 'utils';
import { PartnerLogos } from './partner-logos';
import { StarterPackIcon } from './starter-pack-icon';

const StarterPackListStyle = styled.div`
  && [data-wrap] {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  && > div > div > div:first-child > [data-wrap] {
    padding-top: 0;
  }

  && > div > div > div:last-child:not(:has([data-wrap])) {
    padding-top: 28px;
  }
`;

type StarterPackStep = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  linkLabel: string;
  href: string;
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
};

const STEPS: StarterPackStep[] = [
  {
    icon: <IconWallet />,
    title: 'Prepare tokens for bond',
    description:
      'From 1.5 ETH up to 32 ETH for the first validator, depending on the operator type you choose',
    linkLabel: 'Learn more',
    href: LIDO_OPERATOR_PORTAL_BONDS_INFO,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.starterPackBondLink,
  },
  {
    icon: <IconBox />,
    title: 'Prepare hardware',
    description: 'Run your own hardware or use a cloud provider',
    linkLabel: 'Learn more',
    href: PREPARE_HARDWARE_LINK,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.starterPackHardwareLink,
  },
  {
    icon: <IconAdjust />,
    title: 'Setup validation tools',
    description: (
      <>
        Do it manually or use Plug&Play solutions
        <PartnerLogos />
      </>
    ),
    linkLabel: 'Setup guide',
    href: CSM_NODE_SETUP_LINK,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.starterPackSetupValidatorLink,
  },
  {
    icon: <IconKeyRound />,
    title: 'Generate keys',
    description: 'Prepare deposit data (.json file) for submitting keys',
    linkLabel: 'Generation guide',
    href: HOW_TO_GENERATE_DEPOSIT_DATA_LINK,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.starterPackGenerateKeysLink,
  },
];

export const StarterPackCard: FC<{ onGetStarted: () => void }> = ({
  onGetStarted,
}) => {
  const handleGetStarted = () => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.starterPackGetStarted);
    onGetStarted();
  };

  return (
    <StarterPackListStyle>
      <HubList
        footer={
          <Button
            onClick={handleGetStarted}
            data-testid="starterPackGetStarted"
          >
            Get started
          </Button>
        }
      >
        {STEPS.map((step) => (
          <HubRow
            key={step.title}
            media={<StarterPackIcon>{step.icon}</StarterPackIcon>}
            title={step.title}
            description={step.description}
            trailing={
              <Button
                variant="outline"
                size="small"
                href={step.href}
                iconRight={<IconLink />}
                onClick={() => trackMatomoEvent(step.matomoEvent)}
              >
                {step.linkLabel}
              </Button>
            }
          />
        ))}
      </HubList>
    </StarterPackListStyle>
  );
};
