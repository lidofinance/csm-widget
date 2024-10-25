import {
  Text,
  themeDark,
  themeLight,
  ThemeProvider,
  useThemeToggle,
} from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { AlertClose, AlertStyled } from './styles';

export const Alert: FC<
  PropsWithChildren<{ title?: string; onClose?: () => void }>
> = ({ children, title, onClose }) => {
  const { themeName } = useThemeToggle();

  return (
    <ThemeProvider theme={themeName === 'light' ? themeDark : themeLight}>
      <AlertStyled>
        {onClose ? <AlertClose onClick={onClose} /> : null}
        {title ? (
          <Text size="xs" weight="bold">
            {title}
          </Text>
        ) : null}
        {children}
      </AlertStyled>
    </ThemeProvider>
  );
};
