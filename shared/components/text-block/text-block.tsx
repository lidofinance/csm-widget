import { InlineLoader } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import {
  GrayText,
  TextBlockContent,
  TextBlockStyle,
  TextBlockStyleProps,
  TextBlockTitle,
  TextBlockValue,
} from './style';

type Props = {
  title?: ReactNode;
  description?: ReactNode;
  help?: string;
  loading?: boolean;

  warning?: boolean;
  align?: TextBlockStyleProps['$align'];
  size?: 'xs' | 'sm';
};

export const TextBlock: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  description,
  help,
  loading,
  warning,
  align,
  size,
  ...props
}) => {
  return (
    <TextBlockStyle {...props} $align={align} $warning={warning}>
      {title && (
        <Stack gap="xs" center>
          <TextBlockTitle data-testid="textTitleContent">
            {title}
          </TextBlockTitle>
          <IconTooltip tooltip={help} />
        </Stack>
      )}
      {loading ? (
        <InlineLoader />
      ) : (
        <TextBlockValue>
          {children && (
            <TextBlockContent data-testid="textContent" $size={size}>
              {children}
            </TextBlockContent>
          )}
          {description && (
            <GrayText data-testid="subtextContent">{description}</GrayText>
          )}
        </TextBlockValue>
      )}
    </TextBlockStyle>
  );
};
