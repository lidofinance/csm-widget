import { Card, CardProps } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import { FC } from 'react';
import s from './promo-card.module.css';

type PromoCardProps = CardProps & {
  $radius?: 'lg' | 'xl';
  $gradient?: 'border' | 'fill';
};

export const PromoCard: FC<PromoCardProps> = ({
  $radius = 'lg',
  $gradient,
  className,
  ...props
}) => (
  <Card
    {...props}
    align="stretch"
    className={cn(s.root, className)}
    data-radius={$radius}
    data-gradient={$gradient}
  />
);
