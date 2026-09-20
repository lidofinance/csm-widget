import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { moduleMeta } from 'consts/module';
import { FC } from 'react';
import { useExternalLinks } from 'shared/hooks';
import { MatomoLink } from 'shared/components';
import { ArrowStyled, BlockStyled } from './styles';

export const LandingBlock: FC = () => {
  const { landing } = useExternalLinks();

  return (
    <BlockStyled>
      <DarkThemeProvider>
        <MatomoLink href={landing}>
          Learn more about {moduleMeta.shortTitle} <ArrowStyled />
        </MatomoLink>
      </DarkThemeProvider>
    </BlockStyled>
  );
};
