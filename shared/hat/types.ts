import { Component } from 'types';
import { BlockProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

export type HatComponent = FC<BlockProps>;

export type HatRowComponent = Component<'div'>;

export type HatBalanceComponent = Component<
  'div',
  {
    title: React.ReactNode;
    value: React.ReactNode;
    small?: boolean;
    loading?: boolean;
    extra?: React.ReactNode;
  }
>;
