import { Text } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { StyledAccordion } from './styles';
import { useDappStatus, useOtherModule } from 'modules/web3';

const REPLACEMENTS: Record<string, string> = {
  'curated-onchain-v1': 'Lido Curated',
};

export const OtherModuleBanner: FC = () => {
  const { operatorsWidget } = getExternalLinks();
  const { address } = useDappStatus();
  const { data } = useOtherModule(address);
  const moduleName = (data && REPLACEMENTS[data]) ?? data;

  if (!moduleName) return null;

  return (
    <StyledAccordion
      defaultExpanded={true}
      summary={
        <Text size="sm" weight={700}>
          You have a Node Operator in the {moduleName} module
        </Text>
      }
    >
      <Text size="xxs">
        To become a Node Operator in CSM, start by uploading your first key
        here.
        <br />
        If you want to upload keys to another module (Curated or Simple DVT),
        navigate to{' '}
        <MatomoLink
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.otherModuleLink}
          href={`${operatorsWidget}/submitter`}
        >
          operators.lido.fi
        </MatomoLink>
      </Text>
    </StyledAccordion>
  );
};
