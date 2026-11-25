import {
  IconCheck,
  IconWarning,
  InfoTooltip,
  Tag,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { pluralKeys } from 'utils/plural';
import s from './keys-needed-tag.module.css';

type Props = {
  potentialAdditionalKeys: number | undefined;
  empty?: boolean;
  weightZero?: boolean;
  pending?: boolean;
  dataTestId?: string;
};

export const getKeysNeededVariant = (
  count: number,
  empty?: boolean,
): 'success' | 'warning' | 'error' => {
  if (count === 0) return 'success';
  return empty ? 'error' : 'warning';
};

export const KeysNeededTag: FC<Props> = ({
  potentialAdditionalKeys: count,
  empty,
  weightZero,
  pending,
  dataTestId = 'moreKeysChip',
}) => {
  if (pending || weightZero || count === undefined) return null;

  if (count === 0) {
    return (
      <Tag
        variant="success"
        icon={<IconCheck />}
        dataTestId={{ root: dataTestId }}
      >
        Enough keys
      </Tag>
    );
  }

  return (
    <Tag
      variant={getKeysNeededVariant(count, empty)}
      icon={<IconWarning />}
      dataTestId={{ root: dataTestId }}
    >
      Add {count} more {pluralKeys({ value: count })}
      <InfoTooltip
        className={s.tooltip}
        size={16}
        content="Each node operator is expected to pre-upload 10 additional keys on top of the Total Stake Allocation for the case of the protocol growth"
      />
    </Tag>
  );
};
