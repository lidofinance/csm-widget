import { Button, Text } from '@lidofinance/lido-ui';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { CSM_TESTNET_LINK } from 'consts/external-links';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { StyledBlock, StyledStack } from './styles';

const { defaultChain } = getConfig();

// TODO: matomo events
export const TryCSM: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;

  if (isMainnet)
    return (
      <StyledBlock>
        <StyledStack>
          <Text weight={700} size="lg">
            Try CSM on Holesky
          </Text>
          <MatomoLink href={CSM_TESTNET_LINK}>
            <Button size="xs" variant="outlined">
              Join CSM testnet
            </Button>
          </MatomoLink>
        </StyledStack>
        <Text color="secondary" size="xs">
          CSM uses Holesky as a testnet playground for those who want to try the
          module in action in a test environment.
        </Text>
      </StyledBlock>
    );

  return null; // TODO: remove after deploy csm.lido.fi
  // return (
  //   <StyledBlock>
  //     <StyledStack>
  //       <Text weight={700} size="lg">
  //         Try CSM on Mainnet
  //       </Text>
  //       <MatomoLink href={CSM_MAINNET_LINK}>
  //         <Button size="xs" variant="outlined">
  //           Join CSM Mainnet
  //         </Button>
  //       </MatomoLink>
  //     </StyledStack>
  //   </StyledBlock>
  // );
};
