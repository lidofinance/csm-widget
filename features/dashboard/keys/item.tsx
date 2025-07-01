import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { Counter, Stack } from 'shared/components';
import {
  ActionStyled,
  BoxStyled,
  CountStyled,
  ItemStyled,
  TitleStyled,
} from './styles';

type ItemProps = {
  title: string;
  count?: number | string;
  tooltip?: string;
  variant?: 'warning' | 'secondary';
  reverse?: boolean;
};

export const Item: FC<ItemProps> = ({
  title,
  tooltip,
  count,
  variant,
  reverse,
}) => {
  const isEmptyCount = !count || typeof count === 'string';
  const secondary = variant === 'secondary' || isEmptyCount;
  const warning = variant === 'warning' && !isEmptyCount;

  const body = (
    <ItemStyled $secondary={secondary} $warning={warning} $reverse={reverse}>
      <CountStyled>
        {count === undefined ? <InlineLoader /> : count}
      </CountStyled>
      {title}
    </ItemStyled>
  );

  if (tooltip) {
    return (
      <Tooltip placement="top" title={tooltip}>
        {body}
      </Tooltip>
    );
  }
  return body;
};

type ItemActionProps = {
  action: ReactNode;
  title?: string;
  count: number;
};

export const ItemAction: FC<ItemActionProps> = ({ count, title, action }) =>
  title ? (
    <ActionStyled>
      <Stack>
        <Counter warning count={count} />
        <TitleStyled>{title}</TitleStyled>
      </Stack>
      <BoxStyled>{action}</BoxStyled>
    </ActionStyled>
  ) : null;
