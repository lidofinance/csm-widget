import { External, Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { Stack } from 'shared/components';
import { StyledLink } from './styles';

type Props = {
  href: string;
  title: string;
  icon?: ReactNode;
};

export const ExternalButtonLink: FC<PropsWithChildren<Props>> = ({
  href,
  title,
  icon,
  children,
}) => (
  <StyledLink href={href}>
    <Stack gap="sm" center>
      {icon}
      <Stack gap="xs" center>
        <Text as="span" size="sm" weight={700}>
          {title}
        </Text>
        <External />
      </Stack>
    </Stack>
    <Text size="xxs" color="secondary">
      {children}
    </Text>
  </StyledLink>
);
