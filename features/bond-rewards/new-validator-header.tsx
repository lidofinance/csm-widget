import {
  Callout,
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
import { useModuleMeta, useShowRule } from 'shared/hooks';
import styled from 'styled-components';
import { getNewValidatorProgress } from './new-validator-progress';

const BandStyled = styled(Stack)`
  padding: 12px 24px;
  background: var(--lido-app-ui-color-tint-active);
  color: var(--lido-app-ui-color-text-active);
`;

const INHERIT_COLOR = { color: 'inherit' };

const BarStyled = styled.div`
  flex: 1;
  min-width: 120px;
`;

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
      <Callout
        tone="active"
        href={PATH.KEYS_SUBMIT}
        dataTestId={{ root: 'newValidatorReady' }}
      >
        You&apos;re ready to submit a new {moduleMeta?.shortName} validator with
        your Rewards &amp; Excess bond
      </Callout>
    );
  }

  return (
    <BandStyled
      direction={{ base: 'row', mdDown: 'column' }}
      align={{ base: 'center', mdDown: 'stretch' }}
      gap={16}
      dataTestId={{ root: 'newValidatorProgress' }}
    >
      <Stack direction="row" align="center" gap={8}>
        <Typography as="span" weight="semibold" style={INHERIT_COLOR}>
          New Validator
        </Typography>
        <InfoTooltip content="Share of the bond required for one more validator that is covered by your Rewards and Excess bond" />
      </Stack>
      <BarStyled>
        <ProgressBar
          value={progress}
          max={100}
          size="small"
          aria-label="New Validator progress"
        />
      </BarStyled>
      <Typography as="span" weight="semibold" style={INHERIT_COLOR}>
        {progress}%
      </Typography>
    </BandStyled>
  );
};

export const NewValidatorHeader: FC = () => {
  const check = useShowRule();

  if (!check('IS_CSM_FAMILY') || !check('HAS_MANAGER_ROLE')) return null;

  return <NewValidatorStrip />;
};
