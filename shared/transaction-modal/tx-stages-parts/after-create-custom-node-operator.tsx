import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useModalActions } from 'providers/modal-provider';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { useBeaconchainDashboardLink } from 'shared/hooks';
import { Disconnect } from 'shared/wallet';
import styled from 'styled-components';
import { NodeOperatorId } from 'types';

type Props = {
  nodeOperatorId?: NodeOperatorId;
  keys: string[];
};

export const AfterCreateCustomNodeOperator: FC<Props> = ({ keys }) => {
  const beaconchainDashboardLink = useBeaconchainDashboardLink(keys);
  const { subscribeEvents, beaconchain } = getExternalLinks();
  const { closeModal } = useModalActions();

  return (
    <>
      <BlockStyled color="background">
        <b>What is next: </b>
        <br />
        <ol>
          <li>
            Connect to CSM UI with the address you specified as Reward/Manager
            Address
          </li>
          <li>Wait for your keys to be deposited to through the protocol.</li>
          <li>
            Once your keys become active (
            {beaconchain && (
              <>
                you can check their statuses on{' '}
                <MatomoLink
                  matomoEvent={
                    MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchain
                  }
                  href={beaconchain}
                >
                  beaconcha.in
                </MatomoLink>{' '}
                or{' '}
              </>
            )}
            subscribe to the{' '}
            <MatomoLink
              matomoEvent={
                MATOMO_CLICK_EVENTS_TYPES.createSuccessSubscribeEvents
              }
              href={subscribeEvents}
            >
              CSM events notifications
            </MatomoLink>
            ) make sure your validators are producing attestations{' '}
            {beaconchainDashboardLink && (
              <>
                (you can use the{' '}
                <MatomoLink
                  matomoEvent={
                    MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchainDashboard
                  }
                  href={beaconchainDashboardLink}
                >
                  beaconcha.in dashboard
                </MatomoLink>{' '}
                to check)
              </>
            )}
          </li>
        </ol>
      </BlockStyled>
      <br />
      <Disconnect onClick={() => closeModal()} fullwidth>
        Disconnect wallet
      </Disconnect>
    </>
  );
};

const BlockStyled = styled.div`
  text-align: left;
  line-height: 24px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;
