import { ButtonProps, External } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { StyledButton, StyledLink } from './style';

type LinkButtonProps = {
  href: string;
} & ButtonProps;

export const LinkButton: FC<PropsWithChildren<LinkButtonProps>> = ({
  children,
  href,
  ...props
}) => {
  return (
    <StyledLink href={href}>
      <StyledButton size="xs" color="secondary" {...props}>
        {children} <External />
      </StyledButton>
    </StyledLink>
  );
};
