import { OPERATOR_TYPE_TITLE } from 'consts';
import { useCurveParameters } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { ParametersList } from 'shared/components';
import { getOperatorType } from 'utils';
import { StyledModal } from './styles';

export const ParametersModal: ModalComponentType<{
  curveId: bigint;
}> = ({ open, onClose, curveId }) => {
  const { data: parameters } = useCurveParameters(curveId);
  const type = getOperatorType(curveId);

  if (!type) {
    return null;
  }

  return (
    <StyledModal
      title={OPERATOR_TYPE_TITLE[type]}
      onClose={onClose}
      open={open}
      $variant={type}
    >
      <ParametersList parameters={parameters} />
    </StyledModal>
  );
};
