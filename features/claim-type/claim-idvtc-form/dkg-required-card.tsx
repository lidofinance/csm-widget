import { Body, Button, H3, Stack } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useHasNonWithdrawnKeys, useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { useNavigate } from 'shared/navigate';
import { DkgCardStyle, DkgIllustration } from './styles';

export const DkgRequiredCard: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: hasNonWithdrawnKeys } = useHasNonWithdrawnKeys(nodeOperatorId);
  const navigate = useNavigate();

  if (!hasNonWithdrawnKeys) return null;

  return (
    <DkgCardStyle dataTestId={{ root: 'dkgRequiredCard' }}>
      <Stack align="center" gap={16} style={{ textAlign: 'center' }}>
        <DkgIllustration aria-hidden="true" />
        <H3>Upload DKG Files Required</H3>
        <Body color="secondary">
          This Node Operator is configured as IDVTC. To keep the IDVTC status,
          please upload the DKG files that prove the validator keys were
          generated through a DKG ceremony.
        </Body>
        <Button fullWidth onClick={() => void navigate(PATH.IDVTC_DKG)}>
          Upload files
        </Button>
      </Stack>
    </DkgCardStyle>
  );
};
