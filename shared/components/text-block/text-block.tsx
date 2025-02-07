import { InlineLoader } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import {
  GrayText,
  TextBlockContent,
  TextBlockStyle,
  TextBlockStyleProps,
  TextBlockTitle,
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
}) => {
  return (
    <TextBlockStyle $align={align} $warning={warning}>
      {title && (
        <Stack gap="xs" center>
          <TextBlockTitle>{title}</TextBlockTitle>
          <IconTooltip tooltip={help} />
        </Stack>
      )}
      {loading ? (
        <InlineLoader />
      ) : (
        <>
          {children && (
            <TextBlockContent $size={size}>{children}</TextBlockContent>
          )}
          {description && <GrayText>{description}</GrayText>}
        </>
      )}
    </TextBlockStyle>
  );
};
