import { Text } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import {
  ExternalMatomoLink,
  FormTitle,
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
          <ExternalMatomoLink
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#dappnode"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysDappnodeLink}
          >
            Guide for Dappnode
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#sedge"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysSedgeLink}
          >
            Guide for Sedge
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#stereum"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysSteureumLink}
          >
            Guide for Stereum
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#ethpillar"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysEthpillarLink}
          >
            Guide for EthPillar
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#eth-docker"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysEthdockerLink}
          >
            Guide for EthDocker
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink
            href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#systemd"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.exitKeysSystemdLink}
          >
            Guide for Systemd
          </ExternalMatomoLink>
        </li>
      </StackStyle>
      <WarningBlock type="notice">
        This action should be performed <b>outside the CSM UI</b>
      </WarningBlock>
    </>
  );
};
