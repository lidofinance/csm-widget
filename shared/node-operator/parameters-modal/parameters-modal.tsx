import { getModuleOperatorType, OPERATOR_TYPE_METADATA } from 'consts';
import { useLidoSDK, useCurveParameters } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { ParametersList } from 'shared/components';
import { StyledModal } from './styles';

export const ParametersModal: ModalComponentType<{
  curveId: bigint;
}> = ({ open, onClose, curveId }) => {
  const { sm } = useLidoSDK();
  const { data: parameters } = useCurveParameters(curveId);
  const type = getModuleOperatorType(sm.core.moduleName, curveId);

  return (
    <StyledModal
      title={OPERATOR_TYPE_METADATA[type].title}
      onClose={onClose}
      open={open}
      $variant={type}
    >
      <ParametersList parameters={parameters} />
    </StyledModal>
  );
};
