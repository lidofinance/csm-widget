import { SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';

const SectionStyle = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export type HubSectionProps = PropsWithChildren<{
  title: string;
  subtitle?: ReactNode;
  tooltip?: ReactNode;
  action?: ReactNode;
  dataTestId?: string;
}>;

export const HubSection: FC<HubSectionProps> = ({
  title,
  subtitle,
  tooltip,
  action,
  dataTestId,
  children,
}) => (
  <SectionStyle data-testid={dataTestId}>
    <SectionTitle
      size="large"
      title={title}
      subtitle={subtitle}
      tooltip={tooltip}
      action={action}
    />
    {children}
  </SectionStyle>
);
