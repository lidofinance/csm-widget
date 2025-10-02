import { Text } from '@lidofinance/lido-ui';
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
          <ExternalMatomoLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#dappnode">
            Guide for Dappnode
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#sedge">
            Guide for Sedge
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#stereum">
            Guide for Stereum
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#ethpillar">
            Guide for EthPillar
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#eth-docker">
            Guide for EthDocker
          </ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink href="https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores#systemd">
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
