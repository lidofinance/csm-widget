import { useCurveParameters } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';

import { OPERATOR_TYPE } from 'consts';
import { StyledModal } from './styles';
import { ParametersList } from 'shared/components';

const TITLES: Record<OPERATOR_TYPE, string> = {
  [OPERATOR_TYPE.PLS]: 'Permissionless Staker (PLS)',
  [OPERATOR_TYPE.LEA]: 'Legacy Early Adopter (LEA)',
  [OPERATOR_TYPE.ICS]: 'Identified Community Staker (ICS)',
  [OPERATOR_TYPE.CC]: 'Custom curve (CC)',
};

export const ParametersModal: ModalComponentType<{
  type: OPERATOR_TYPE;
  curveId: bigint;
}> = ({ open, onClose, type, curveId }) => {
  const { data: parameters } = useCurveParameters(curveId);

  return (
    <StyledModal
      title={TITLES[type]}
      onClose={onClose}
      open={open}
      $variant={type}
    >
      <ParametersList parameters={parameters} />
    </StyledModal>
  );
};
