import { Tooltip } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { ShortInlineLoader, Stack } from 'shared/components';
import { TitleStyle, VARIANTS, WrapperStyle } from './styles';

type KeysItemProps = {
  title: string;
  count: number | undefined;
  tooltip?: string;
  type?: keyof typeof VARIANTS;
  comment?: ReactNode;
  ignoreCountZero?: boolean;
};

export const KeysItem: FC<KeysItemProps> = ({
  title,
  count,
  type,
  comment,
  tooltip,
  ignoreCountZero,
}) => {
  const hasCount =
    count === undefined ? undefined : count > 0 || ignoreCountZero;
  const variant = hasCount
    ? (type ?? 'active')
    : type === 'active'
      ? type
      : undefined;

  return (
    <WrapperStyle $variant={variant}>
      <Stack direction="column" gap="xs">
        <TitleStyle>
          <Tooltip title={tooltip} placement="topLeft">
            <span>{title}</span>
          </Tooltip>
          {count === undefined ? <ShortInlineLoader /> : <b>{count}</b>}
        </TitleStyle>
        {hasCount ? comment : null}
      </Stack>
    </WrapperStyle>
  );
};
