import { ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { ComponentProps, FC } from 'react';
import { SecondaryLocalLink } from 'shared/navigate';
import { WrapStyle } from './styles.ts';

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
      <WrapStyle>
        <ArrowLeft />
        {text}
      </WrapStyle>
    </SecondaryLocalLink>
  );
};
