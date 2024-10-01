import { DarkThemeProvider, Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { AlertStyled } from './styles';

export const Alert: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => (
  <DarkThemeProvider>
    <AlertStyled>
      <Text size="xs" weight="bold">
        {title}
      </Text>
      {children}
    </AlertStyled>
  </DarkThemeProvider>
);
