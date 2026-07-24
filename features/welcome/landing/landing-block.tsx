import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts';
import { moduleMeta } from 'consts/module';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { ArrowStyled, BlockStyled } from './styles';

const { landing } = getExternalLinks();

export const LandingBlock: FC = () => (
  <BlockStyled>
    <DarkThemeProvider>
      <MatomoLink href={landing}>
        Learn more about {moduleMeta.shortTitle} <ArrowStyled />
      </MatomoLink>
    </DarkThemeProvider>
  </BlockStyled>
);
