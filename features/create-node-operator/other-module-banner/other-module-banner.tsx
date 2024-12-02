import { Text } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { useOperatorInOtherModule } from 'shared/hooks';
import { StyledAccordion } from './styles';

export const OtherModuleBanner: FC = () => {
  const { operatorsWidget } = getExternalLinks();
  const { data: moduleName } = useOperatorInOtherModule();

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
