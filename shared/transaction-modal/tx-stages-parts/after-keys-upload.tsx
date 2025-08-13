import { getExternalLinks, SUBSCRIBE_EVENTS_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { useBeaconchainDashboardLink } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { NodeOperatorId } from 'types';

type Props = {
  nodeOperatorId?: NodeOperatorId;
  keys: string[];
};

export const AfterKeysUpload: FC<Props> = ({ keys }) => {
  const beaconchainDashboardLink = useBeaconchainDashboardLink(keys);
  const { beaconchain } = getExternalLinks();
  return (
    <BlockStyled color="background">
      <b>What is next: </b>
      <br />
      <ol>
        <li>Wait for your keys to be deposited to through the protocol.</li>
        <li>
          Once your keys become active (you can check their statuses on the{' '}
          <LocalLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab}
            href={PATH.KEYS_VIEW}
          >
            Keys tab
          </LocalLink>
          {beaconchain && (
            <>
              , on{' '}
              <MatomoLink
                matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchain}
                href={beaconchain}
              >
                beaconcha.in
              </MatomoLink>
            </>
          )}{' '}
          or subscribe to the{' '}
          <MatomoLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessSubscribeEvents}
            href={SUBSCRIBE_EVENTS_LINK}
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
  );
};

const BlockStyled = styled.div`
  text-align: left;
  line-height: 24px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;
