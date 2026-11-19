import {
  Card,
  Description,
  Divider,
  IconArrowRight,
  Stack,
  StatItem,
  TextLink,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export type StatCardProps = {
  title: ReactNode;
  info?: ReactNode;
  link?: { label: ReactNode; href: string; onClick?: () => void };
  value: ReactNode;
  loading?: boolean;
  subValue?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
  dataTestId?: { root?: string; link?: string; value?: string };
};

const CardStyled = styled(Card)`
  && {
    height: 100%;
  }
`;

export const StatCard: FC<StatCardProps> = ({
  title,
  info,
  link,
  value,
  loading,
  subValue,
  description,
  footer,
  className,
  dataTestId,
}) => (
  <CardStyled
    align="stretch"
    gap={24}
    className={className}
    dataTestId={{ root: dataTestId?.root }}
  >
    <Stack direction="column" gap={8}>
      <Stack direction="row" justify="between" align="start" gap={16}>
        <StatItem
          align="left"
          label={title}
          info={info}
          value={value}
          loading={loading}
          subValue={subValue}
          dataTestId={{ value: dataTestId?.value }}
        />
        {link && (
          <TextLink
            href={link.href}
            onClick={link.onClick}
            icon={<IconArrowRight />}
            dataTestId={{ root: dataTestId?.link }}
          >
            {link.label}
          </TextLink>
        )}
      </Stack>
      {description != null && (
        <Description as="div" color="tertiary">
          {description}
        </Description>
      )}
    </Stack>
    {footer != null && (
      <>
        <Divider />
        {footer}
      </>
    )}
  </CardStyled>
);
