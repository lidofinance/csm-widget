import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { MODULE_METADATA } from 'consts';
import { BadgeModuleStyle } from './styles';

type ModuleBadgeProps = {
  module?: MODULE_NAME;
};

export const ModuleBadge: FC<ModuleBadgeProps> = ({ module }) => {
  if (!module) return null;
  return (
    <BadgeModuleStyle>{MODULE_METADATA[module].shortName}</BadgeModuleStyle>
  );
};
