import { Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { AlertClose, AlertStyled } from './styles';

export const Alert: FC<
  PropsWithChildren<{
    title?: string;
    onClose?: () => void;
    'data-testid'?: string;
  }>
> = ({ children, title, onClose, ...rest }) => (
  <AlertStyled {...rest}>
    {onClose ? <AlertClose onClick={onClose} /> : null}
    {title ? (
      <Text size="xs" weight="bold">
        {title}
      </Text>
    ) : null}
    {children}
  </AlertStyled>
);
