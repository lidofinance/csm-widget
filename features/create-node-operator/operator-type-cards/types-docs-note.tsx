import { Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPES_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';

export const TypesDocsNote = () => (
  <Text size="xxs">
    Check out details about{' '}
    <MatomoLink
      $inline
      href={OPERATOR_TYPES_LINK}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.operatorTypesDocsLink}
    >
      operator types and parameters
    </MatomoLink>{' '}
    to learn more.
  </Text>
);
