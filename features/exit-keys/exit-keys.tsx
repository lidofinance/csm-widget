import { Text } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { MODULE_SHORT_NAME } from 'consts/module';
import { config } from 'config';
import {
  FormTitle,
  MatomoLink,
  StackStyle,
  WarningBlock,
} from 'shared/components';
import { Gate } from 'shared/navigate';

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
      <Gate rule="IS_CM">
        <WarningBlock type="warning">
          Out of order exits are discouraged by{' '}
          <MatomoLink href="https://ipfs.io/ipfs/QmW9kE61zC61PcuikCQRwn82aoTCj9yPuENGNPML9QLkSM">
            the Validator Exits Standard Node Operator Protocol (SNOP)
          </MatomoLink>
          . In case an out of order exit is required, the Node Operator must
          notify the community, specifying the number of validators affected,
          their indices, and the reason for the exit request via{' '}
          <MatomoLink href="https://research.lido.fi/c/node-operators/12">
            the Node Operator category of the Lido Research Forum
          </MatomoLink>
          .
        </WarningBlock>
      </Gate>
      <WarningBlock type="notice">
        This action should be performed{' '}
        <b>outside the {MODULE_SHORT_NAME[config.module]} UI</b>
      </WarningBlock>
    </>
  );
};
