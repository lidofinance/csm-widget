import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { ArrowStyled, BlockStyled } from './styles';

const { landing } = getExternalLinks();

export const LandingBlock: FC = () => (
  <BlockStyled>
    <DarkThemeProvider>
      <MatomoLink href={landing}>
        Learn more about CSM <ArrowStyled />
      </MatomoLink>
    </DarkThemeProvider>
  </BlockStyled>
);
