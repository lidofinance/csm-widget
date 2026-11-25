import {
  Address as AddressComponent,
  Caption,
  Description,
  Identicon,
  Body,
  TypographyColor,
  TypographyWeight,
} from '@lidofinance/lido-app-ui';
import { CSSProperties, FC, ReactNode } from 'react';
import { Tooltip } from '@lidofinance/lido-app-ui';
import { EtherscanAddressLink } from '../external-icon-link';
import cn from 'classnames';
import s from './styles.module.css';

export type AddressProps = {
  showIcon?: boolean;
  big?: boolean;
  monospace?: boolean;
  link?: ReactNode;
  name?: string;
  avatar?: string;
  noStyle?: boolean;
  address?: string;
  symbols?: number;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  weight?: TypographyWeight | number;
  color?: TypographyColor;
};

const toWeight = (weight: TypographyWeight | number | undefined) => {
  if (typeof weight !== 'number') return weight;
  if (weight >= 700) return 'bold';
  if (weight >= 600) return 'semibold';
  if (weight >= 500) return 'medium';
  return 'regular';
};

const TEXT = { xxs: Caption, xs: Description, sm: Body, md: Body, lg: Body };

export const AddressInner: FC<AddressProps> = ({
  address = '',
  symbols = 6,
  showIcon = false,
  big = false,
  weight,
  size = 'xs',
  color,
  noStyle = false,
  link,
  avatar,
  name,
}) => {
  const content = name ?? (
    <AddressComponent
      address={address}
      symbols={!symbols ? 90 : symbols}
      tooltip={false}
    />
  );

  const Text = TEXT[size];
  const component = noStyle ? (
    <span data-testid="addressText">{content}</span>
  ) : (
    <Text
      as="span"
      weight={toWeight(weight)}
      color={color}
      data-testid="addressText"
    >
      {content}
    </Text>
  );

  return (
    <>
      {address && (
        <span
          className={cn(s.container, !big && s.small)}
          data-testid="addressContainer"
        >
          {showIcon &&
            (avatar ? (
              <img
                className={s.avatar}
                style={
                  { '--avatar-size': `${big ? 24 : 20}px` } as CSSProperties
                }
                src={avatar}
                alt=""
                data-testid="avatar"
              />
            ) : (
              <Identicon
                address={address}
                size={big ? 24 : 20}
                data-testid="identicon"
              />
            ))}
          {symbols === 0 && !name ? (
            component
          ) : (
            <Tooltip
              position="top"
              content={address}
              width={300}
              data-testid="addressTooltip"
            >
              {component}
            </Tooltip>
          )}
          {link ?? (
            <EtherscanAddressLink
              $secondary={!big}
              address={address}
              data-testid="etherscanLink"
            />
          )}
        </span>
      )}
    </>
  );
};
