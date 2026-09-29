import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { useHasNonWithdrawnKeys, useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { Block, Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { useClaimIdvtcFormData } from './context';
import { DkgCardRow, DkgIllustration } from './styles';

export const DkgRequiredCard: FC = () => {
  const { justClaimed } = useClaimIdvtcFormData();
  const nodeOperatorId = useNodeOperatorId();
  const { data: hasNonWithdrawnKeys } = useHasNonWithdrawnKeys(nodeOperatorId);

  if (!justClaimed || !hasNonWithdrawnKeys) return null;

  return (
    <Block data-testid="dkgRequiredCard">
      <DkgCardRow>
        <DkgIllustration />
        <Stack direction="column">
          <Text size="xl" weight={700}>
            Upload DKG Files Required
          </Text>
          <Text size="xs">
            This Node Operator is configured as IDVTC. To keep the IDVTC status,
            please upload the DKG files that prove the validator keys were
            generated through a DKG ceremony.
          </Text>
          <LocalLink href={PATH.IDVTC_DKG}>
            <Button size="sm">Upload files</Button>
          </LocalLink>
        </Stack>
      </DkgCardRow>
    </Block>
  );
};
