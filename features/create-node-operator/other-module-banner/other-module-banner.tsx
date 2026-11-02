import { Accordion, Body } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MODULE_METADATA } from 'consts/module';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useOtherModule } from 'modules/web3';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';

const REPLACEMENTS: Record<string, string> = {
  'curated-onchain-v1': 'Lido Curated v1',
};

export const OtherModuleBanner: FC<{ module: MODULE_NAME }> = ({ module }) => {
  const { operatorsWidget } = getExternalLinks();
  const { data } = useOtherModule(undefined, module);
  const moduleName = (data && REPLACEMENTS[data]) ?? data;

  if (!moduleName) return null;

  return (
    <Accordion
      defaultExpanded
      title={`You have a Node Operator in the ${moduleName} module`}
    >
      <Body as="div">
        To become a Node Operator in {MODULE_METADATA[module].shortTitle},
        continue here.
        <br />
        If you want to upload keys to another module (Curated v1 or Simple DVT),
        navigate to{' '}
        <MatomoLink
          $inline
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.otherModuleLink}
          href={`${operatorsWidget}/submitter`}
        >
          operators.lido.fi
        </MatomoLink>
      </Body>
    </Accordion>
  );
};
