import { Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export type StatCardMetaItem = { label: ReactNode; value: ReactNode };

const MetaItem = styled.span`
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-regular);
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  line-height: var(--lido-app-ui-line-height-label);
`;

const MetaLabel = styled.span`
  color: var(--lido-app-ui-color-text-tertiary);
`;

const MetaValue = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
`;

type StatCardMetaProps = {
  items: StatCardMetaItem[];
  className?: string;
};

export const StatCardMeta: FC<StatCardMetaProps> = ({ items, className }) => (
  <Stack direction="row" wrap rowGap={4} columnGap={12} className={className}>
    {items.map((item, index) => (
      <MetaItem key={index}>
        <MetaLabel>{item.label}:</MetaLabel> <MetaValue>{item.value}</MetaValue>
      </MetaItem>
    ))}
  </Stack>
);
