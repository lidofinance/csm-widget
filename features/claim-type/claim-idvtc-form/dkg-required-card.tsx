import { H3 } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useHasNonWithdrawnKeys, useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { useNavigate } from 'shared/navigate';
import {
  DkgCardStyle,
  DkgDescriptionStyle,
  DkgIllustration,
  FullWidthButtonStyle,
} from './styles';

export const DkgRequiredCard: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: hasNonWithdrawnKeys } = useHasNonWithdrawnKeys(nodeOperatorId);
  const navigate = useNavigate();

  if (!hasNonWithdrawnKeys) return null;

  return (
    <DkgCardStyle dataTestId={{ root: 'dkgRequiredCard' }}>
      <DkgIllustration aria-hidden="true" />
      <H3>Upload DKG Files Required</H3>
      <DkgDescriptionStyle>
        This Node Operator is configured as IDVTC. To keep the IDVTC status,
        please upload the DKG files that prove the validator keys were generated
        through a DKG ceremony.
      </DkgDescriptionStyle>
      <FullWidthButtonStyle onClick={() => void navigate(PATH.IDVTC_DKG)}>
        Upload files
      </FullWidthButtonStyle>
    </DkgCardStyle>
  );
};
