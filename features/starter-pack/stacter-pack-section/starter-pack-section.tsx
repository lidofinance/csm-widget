import { FC, PropsWithChildren } from 'react';
import { BlockStyled, Heading } from './styles';
import { Link } from '@lidofinance/lido-ui';
import { dappnodeLidoDocsUrls } from 'dappnode/utils/dappnode-docs-urls';
import { Steps } from 'dappnode/starter-pack/steps';

export const StarterPackSection: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BlockStyled>
      <Heading>
        <h2>CSM in Dappnode starter pack</h2>
        <p>
          Make sure you&apos;ve completed all the basic steps before joining the
          Community Staking Module
        </p>
        <p>
          You can follow a guide in{' '}
          <Link href={dappnodeLidoDocsUrls.register}>
            {' '}
            Dappnode&apos;s Documentation
          </Link>
        </p>
      </Heading>

      <Steps />

      {children}
    </BlockStyled>
  );
};
