import { ComponentProps, useMemo } from 'react';
import { type ExternalButtonLink } from 'shared/components';

import { ReactComponent as BeaconchaIcon } from 'assets/icons/beaconcha.svg';
import { ReactComponent as MigaLabsIcon } from 'assets/icons/migalabs.svg';
import { ReactComponent as LidoIcon } from 'assets/icons/lido.svg';
import { ReactComponent as RatedIcon } from 'assets/icons/rated.svg';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  useBeaconchainDashboardLink,
  useMigaLabsLink,
  useFeesMonitoningLink,
  useOperatorPortalLink,
  useRatedLink,
  useBeaconchainEntityLink,
} from 'shared/hooks';

export const useExternalButtons = () => {
  const beaconchainEntityLink = useBeaconchainEntityLink();
  const beaconchainDashboardLink = useBeaconchainDashboardLink();
  const feesMonitoningLink = useFeesMonitoningLink();
  const operatorPortalLink = useOperatorPortalLink();
  const ratedLink = useRatedLink();
  const migaLabsLink = useMigaLabsLink();

  return useMemo(
    (): ComponentProps<typeof ExternalButtonLink>[] =>
      [
        beaconchainEntityLink && {
          title: 'beaconcha.in Entity',
          icon: <BeaconchaIcon />,
          href: beaconchainEntityLink,
          matomoEvent:
            MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaEntityLink,
          children: 'Overview of your operator on beaconcha.in',
        },
        ratedLink && {
          title: 'Rated explorer',
          icon: <RatedIcon />,
          href: ratedLink,
          matomoEvent: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalRatedLink,
          children:
            'Provides effectiveness ratings, APRs and other useful metrics',
        },
        migaLabsLink && {
          title: 'MigaLabs',
          icon: <MigaLabsIcon />,
          href: migaLabsLink,
          matomoEvent: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalMigaLabsLink,
          children:
            'Provides real-time statistics of your validators’ performance',
        },
        beaconchainDashboardLink && {
          title: 'beaconcha.in v2',
          icon: <BeaconchaIcon />,
          href: beaconchainDashboardLink,
          matomoEvent: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink,
          children:
            'Dashboard displays statistics of your validators (up to 20 in free plan)',
        },
        operatorPortalLink && {
          title: 'Lido Operators Portal',
          icon: <LidoIcon />,
          href: operatorPortalLink,
          matomoEvent:
            MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink,
          children: 'Shows details about invalid keys',
        },
        feesMonitoningLink && {
          title: 'Lido Fees monitoring',
          icon: <LidoIcon />,
          href: feesMonitoningLink,
          matomoEvent:
            MATOMO_CLICK_EVENTS_TYPES.dashboardExternalFeesMonitoringLink,
          children:
            'Tracks missed slots and blocks with incorrect fee recipient/MEV relays',
        },
      ].filter((n) => !!n),
    [
      beaconchainEntityLink,
      ratedLink,
      migaLabsLink,
      beaconchainDashboardLink,
      operatorPortalLink,
      feesMonitoningLink,
    ],
  );
};
