import {
  InfoTooltip,
  SectionTitle,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { FC, ReactNode } from 'react';
import { Address } from 'shared/components';
import { OptionCardsField } from 'shared/hook-form/fields';
import { CLAIM_OPTION, useClaimBondFormData } from '../context';
import { useClaimOptions } from '../hooks/use-claim-options';
import { OptionIconsStyle } from '../styles';

import { ReactComponent as BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as RewardsIcon } from 'assets/balance/rewards.svg';

const OPTION_ICONS: Record<CLAIM_OPTION, ReactNode> = {
  [CLAIM_OPTION.ALL_TO_RA]: (
    <OptionIconsStyle>
      <RewardsIcon />
      <BondIcon />
    </OptionIconsStyle>
  ),
  [CLAIM_OPTION.BOND_TO_RA]: (
    <OptionIconsStyle>
      <BondIcon />
    </OptionIconsStyle>
  ),
  [CLAIM_OPTION.REWARDS_TO_BOND]: (
    <OptionIconsStyle>
      <RewardsIcon />
    </OptionIconsStyle>
  ),
};

const formatShare = (share: bigint) => `${Number(share) / 100}%`;

const SplittersTooltip: FC<{ feeSplits: FeeSplit[] }> = ({ feeSplits }) => (
  <Stack direction="column" gap={12}>
    <span>
      When you claim rewards, they will be distributed according to the
      proportions below
    </span>
    <Stack direction="column" gap={4}>
      {feeSplits.map((split) => (
        <Stack
          key={split.recipient}
          gap={8}
          justify="between"
          data-testid="splittersTooltipRow"
        >
          <Address address={split.recipient} link="" symbols={8} noStyle />
          <span>{formatShare(split.share)}</span>
        </Stack>
      ))}
    </Stack>
  </Stack>
);

const SplittersChip: FC = () => {
  const { feeSplits } = useClaimBondFormData(true);

  if (feeSplits.length === 0) return null;

  return (
    <Tag variant="info" dataTestId={{ root: 'splittersChip' }}>
      SPLITTERS ON{' '}
      <InfoTooltip
        content={<SplittersTooltip feeSplits={feeSplits} />}
        dataTestId={{ root: 'iconTooltip', content: 'tooltipWrapper' }}
      />
    </Tag>
  );
};

export const SourceSelect: FC = () => {
  const { options } = useClaimOptions();

  return (
    <Stack direction="column" gap={16}>
      <SectionTitle title="Select claiming option" action={<SplittersChip />} />
      <OptionCardsField
        name="claimOption"
        aria-label="Select claiming option"
        variant="list"
        orientation="horizontal"
        options={options.map(({ option, label, description, disabled }) => ({
          value: option,
          icon: OPTION_ICONS[option],
          title: <span data-testid="claimOptionLabel">{label}</span>,
          description: (
            <span data-testid="claimOptionDescription">{description}</span>
          ),
          disabled,
        }))}
      />
    </Stack>
  );
};
