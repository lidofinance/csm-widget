import { ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { ComponentProps, FC } from 'react';
import { SecondaryLocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { StackStyle } from '../stack';

type BackButtonProps = {
  href?: PATH;
  text?: string;
  color?: ComponentProps<typeof ButtonIcon>['color'];
};

export const BackButton: FC<BackButtonProps> = ({
  href = PATH.HOME,
  text = 'Back',
}) => {
  return (
    <SecondaryLocalLink href={href}>
      <Wrap>
        <ArrowLeft />
        {text}
      </Wrap>
    </SecondaryLocalLink>
  );
};

const Wrap = styled(StackStyle).attrs({
  $align: 'center',
  $gap: 'xxs',
})`
  padding: 4px;
  margin: -4px;
`;
