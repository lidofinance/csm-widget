import { External, Text } from '@lidofinance/lido-ui';
import { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';
import { MatomoLink, Stack } from 'shared/components';
import { StyledLink } from './styles';

type Props = {
  title: string;
  icon?: ReactNode;
} & Pick<ComponentProps<typeof MatomoLink>, 'href' | 'matomoEvent'>;

export const ExternalButtonLink: FC<PropsWithChildren<Props>> = ({
  href,
  matomoEvent,
  title,
  icon,
  children,
}) => (
  <StyledLink {...{ href, matomoEvent }}>
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
