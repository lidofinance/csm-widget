import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts';
import { MODULE_METADATA } from 'consts/module';
import { config } from 'config';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { ArrowStyled, BlockStyled } from './styles';

const { landing } = getExternalLinks();

export const LandingBlock: FC = () => (
  <BlockStyled>
    <DarkThemeProvider>
      <MatomoLink href={landing}>
        Learn more about {MODULE_METADATA[config.module].shortTitle}{' '}
        <ArrowStyled />
      </MatomoLink>
    </DarkThemeProvider>
  </BlockStyled>
);
