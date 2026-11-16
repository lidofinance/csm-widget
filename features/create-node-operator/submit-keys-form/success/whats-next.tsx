import { BodyLarge } from '@lidofinance/lido-app-ui';
import { getExternalLinks, SUBSCRIBE_EVENTS_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import type { CreateSuccess } from 'features/create-node-operator/create-success/create-success';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { getBeaconchainDashboardLink } from 'shared/hooks/beaconchain-dashboard-link';
import { LocalLink } from 'shared/navigate';
import {
  useNeedsOperatorSwitch,
  useSwitchOperator,
} from 'shared/node-operator';
import { WhatsNextStyle } from './styles';

type WhatsNextProps = { created: CreateSuccess };

export const WhatsNext: FC<WhatsNextProps> = ({ created }) => {
  const { hasRole, keys = [] } = created;
  const { beaconchain } = getExternalLinks();
  const needsSwitch = useNeedsOperatorSwitch(created.operator);
  const switchOperator = useSwitchOperator();
  const dashboardLink =
    beaconchain && keys.length > 0
      ? getBeaconchainDashboardLink(beaconchain, keys)
      : null;

  return (
    <WhatsNextStyle>
      <BodyLarge as="h2" weight="semibold">
        What’s next
      </BodyLarge>
      <ol>
        <li>Wait for your keys to be deposited to through the protocol</li>
        <li>
          Once your keys become active (you can check their statuses
          {hasRole && (
            <>
              {' '}
              on the{' '}
              <LocalLink
                href={PATH.KEYS}
                onClick={() => needsSwitch && switchOperator(created.operator)}
                matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab}
              >
                Keys tab
              </LocalLink>
              {beaconchain && ','}
            </>
          )}
          {beaconchain && (
            <>
              {' '}
              on{' '}
              <MatomoLink
                $inline
                href={beaconchain}
                matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchain}
              >
                beaconcha.in
              </MatomoLink>
            </>
          )}{' '}
          or subscribe to the{' '}
          <MatomoLink
            $inline
            href={SUBSCRIBE_EVENTS_LINK}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessSubscribeEvents}
          >
            CSM events notifications
          </MatomoLink>
          ), make sure your validators are producing attestations
          {dashboardLink && (
            <>
              {' '}
              (you can use the{' '}
              <MatomoLink
                $inline
                href={dashboardLink}
                matomoEvent={
                  MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchainDashboard
                }
              >
                beaconcha.in dashboard
              </MatomoLink>{' '}
              to check)
            </>
          )}
        </li>
      </ol>
    </WhatsNextStyle>
  );
};
