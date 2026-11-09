import {
  InfoTooltip,
  SectionTitle,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Address } from 'shared/components';
import { SegmentCardsField } from 'shared/hook-form/fields';
import { useClaimBondFormData } from '../context';
import { useClaimOptions } from '../hooks/use-claim-options';
import { CLAIM_OPTION_ICONS } from './claim-option-icons';

const formatShare = (share: bigint) => `${Number(share) / 100}%`;

const SplittersTooltip: FC<{
  feeSplits: FeeSplit[];
  rewardsAddress?: string;
}> = ({ feeSplits, rewardsAddress }) => (
  <Stack direction="column" gap={12}>
    <b>Splitters ON</b>
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
          <span>
            <Address address={split.recipient} link="" symbols={8} noStyle />
            {split.recipient.toLowerCase() === rewardsAddress?.toLowerCase() &&
              ' (Bond)'}
          </span>
          <span>{formatShare(split.share)}</span>
        </Stack>
      ))}
    </Stack>
  </Stack>
);

const SplittersChip: FC = () => {
  const { feeSplits, rewardsAddress } = useClaimBondFormData(true);

  if (feeSplits.length === 0) return null;

  return (
    <Tag
      variant="info"
      icon={
        <InfoTooltip
          content={
            <SplittersTooltip
              feeSplits={feeSplits}
              rewardsAddress={rewardsAddress}
            />
          }
          dataTestId={{ root: 'iconTooltip', content: 'tooltipWrapper' }}
        />
      }
      iconPosition="right"
      dataTestId={{ root: 'splittersChip' }}
    >
      Splitters ON
    </Tag>
  );
};

export const SourceSelect: FC = () => {
  const { options } = useClaimOptions();

  return (
    <Stack direction="column" gap={16}>
      <SectionTitle title="Select claiming option" action={<SplittersChip />} />
      <SegmentCardsField
        name="claimOption"
        aria-label="Select claiming option"
        options={options.map(({ option, label, description, disabled }) => ({
          value: option,
          icon: CLAIM_OPTION_ICONS[option],
          title: label,
          description,
          disabled,
          dataTestId: {
            root: `claimOption-${option}`,
            title: 'claimOptionLabel',
            description: 'claimOptionDescription',
          },
        }))}
      />
    </Stack>
  );
};
