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
};

export const KeysItem: FC<KeysItemProps> = ({
  title,
  count,
  type,
  comment,
  tooltip,
}) => {
  const variant =
    !type && count ? 'active' : type === 'error' && !count ? undefined : type;
  return (
    <WrapperStyle $variant={variant}>
      <Stack direction="column" gap="xs">
        <TitleStyle>
          <Tooltip title={tooltip} placement="topLeft">
            <span>{title}</span>
          </Tooltip>
          {count === undefined ? <ShortInlineLoader /> : <b>{count}</b>}
        </TitleStyle>
        {type === 'warning' || (count && count > 0) ? comment : null}
      </Stack>
    </WrapperStyle>
  );
};
