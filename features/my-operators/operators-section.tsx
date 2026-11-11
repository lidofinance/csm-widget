import { Grid, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';

type Props = {
  title: string;
  summary?: ReactNode;
  dataTestId: string;
  titleTestId: string;
  children: ReactNode;
};

export const OperatorsSection: FC<Props> = ({
  title,
  summary,
  dataTestId,
  titleTestId,
  children,
}) => (
  <Stack direction="column" gap={16} data-testid={dataTestId}>
    <SectionTitle
      size="large"
      title={title}
      dataTestId={{ title: titleTestId }}
    />
    <Stack direction="column" gap={8}>
      {summary}
      <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
        {children}
      </Grid>
    </Stack>
  </Stack>
);
