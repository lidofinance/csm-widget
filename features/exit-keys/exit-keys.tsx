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
          <ExternalMatomoLink>Guide for Dappnode</ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink>Guide for Sedge</ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink>Guide for Stereum</ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink>Guide for EthPillar</ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink>Guide for EthDocker</ExternalMatomoLink>
        </li>
        <li>
          <ExternalMatomoLink>Guide for Systemd</ExternalMatomoLink>
        </li>
      </StackStyle>
      <WarningBlock type="notice">
        This action should be performed <b>outside the CSM UI</b>
      </WarningBlock>
    </>
  );
};
