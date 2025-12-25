import { Text } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import {
  FormTitle,
  MatomoLink,
  StackStyle,
  WarningBlock,
} from 'shared/components';

export const ExitKeys = () => {
  return (
    <>
      <FormTitle>Follow the instuctions</FormTitle>
      <Text size="xs">
        Sign and broadcast an exit message for each validator key you want to
        exit using one of the guides below:
      </Text>
      <StackStyle as="ul" $gap="sm" $direction="column">
        <li>
          <MatomoLink
            icon="external"
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#dappnode"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysDappnodeLink}
          >
            Guide for Dappnode
          </MatomoLink>
        </li>
        <li>
          <MatomoLink
            icon="external"
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#sedge"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysSedgeLink}
          >
            Guide for Sedge
          </MatomoLink>
        </li>
        <li>
          <MatomoLink
            icon="external"
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#stereum"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysSteureumLink}
          >
            Guide for Stereum
          </MatomoLink>
        </li>
        <li>
          <MatomoLink
            icon="external"
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#ethpillar"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysEthpillarLink}
          >
            Guide for EthPillar
          </MatomoLink>
        </li>
        <li>
          <MatomoLink
            icon="external"
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#eth-docker"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysEthdockerLink}
          >
            Guide for EthDocker
          </MatomoLink>
        </li>
        <li>
          <MatomoLink
            icon="external"
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#systemd"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysSystemdLink}
          >
            Guide for Systemd
          </MatomoLink>
        </li>
      </StackStyle>
      <WarningBlock type="notice">
        This action should be performed <b>outside the CSM UI</b>
      </WarningBlock>
    </>
  );
};
