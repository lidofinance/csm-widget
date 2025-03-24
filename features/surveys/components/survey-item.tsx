import { Block, Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'shared/components';

type SurveyItemProps = {
  title: ReactNode;
};

export const SurveyItem: FC<PropsWithChildren<SurveyItemProps>> = ({
  children,
  title,
}) => {
  return (
    <Block>
      <Stack align="center" spaceBetween>
        <Text as="h4" size="sm" weight="bold">
          {title}
        </Text>
        <Stack gap="md">{children}</Stack>
      </Stack>
    </Block>
  );
};
