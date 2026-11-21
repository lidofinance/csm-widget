import {
  InfoTooltip,
  ProgressBar,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import {
  useBondNextKeysCount,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorRewards,
} from 'modules/web3';
import { FC } from 'react';
import { MessageBoxLink } from 'shared/components';
import { useModuleMeta, useShowRule } from 'shared/hooks';
import s from './new-validator-header.module.css';
import { getNewValidatorProgress } from './new-validator-progress';

const NewValidatorStrip: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const moduleMeta = useModuleMeta();
  const { data: bond } = useOperatorBalance({ nodeOperatorId });
  const { data: rewards } = useOperatorRewards({ nodeOperatorId });
  const { data: requiredForKey } = useBondNextKeysCount({
    nodeOperatorId,
    token: TOKENS.steth,
    keysCount: 1,
  });

  if (!bond || !rewards || requiredForKey === undefined) return null;

  const progress = getNewValidatorProgress({
    available: rewards.available,
    delta: bond.isInsufficient ? -bond.delta : bond.delta,
    requiredForKey,
  });

  if (progress >= 100) {
    return (
      <div className={s.readyBand}>
        <MessageBoxLink
          variant="info"
          href={PATH.KEYS_SUBMIT}
          dataTestId={{ root: 'newValidatorReady' }}
        >
          You&apos;re ready to submit a new {moduleMeta?.shortName} validator
          with your Rewards &amp; Excess bond
        </MessageBoxLink>
      </div>
    );
  }

  return (
    <Stack
      className={s.band}
      direction="row"
      align="center"
      gap={16}
      dataTestId={{ root: 'newValidatorProgress' }}
    >
      <Stack direction="row" align="center" gap={8}>
        <Typography
          as="span"
          weight="semibold"
          color="active"
          style={{ whiteSpace: 'nowrap' }}
        >
          New Validator
        </Typography>
        <InfoTooltip content="Share of the bond required for one more validator that is covered by your Rewards and Excess bond" />
      </Stack>
      <div className={s.bar}>
        <ProgressBar
          value={progress}
          max={100}
          size="small"
          aria-label="New Validator progress"
        />
      </div>
      <Typography
        as="span"
        weight="semibold"
        color="active"
        style={{ whiteSpace: 'nowrap' }}
      >
        {progress}%
      </Typography>
    </Stack>
  );
};

export const NewValidatorHeader: FC = () => {
  const check = useShowRule();

  if (!check('IS_CSM_FAMILY') || !check('HAS_MANAGER_ROLE')) return null;

  return <NewValidatorStrip />;
};
