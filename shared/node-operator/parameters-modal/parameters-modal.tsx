import { useCurveParameters } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { ParametersList } from 'shared/components';
import { StyledModal } from './styles';
import { OPERATOR_TYPE_METADATA, sdkModuleName } from 'consts';
import { getOperatorTypeByCurveId } from '@lidofinance/lido-csm-sdk';

export const ParametersModal: ModalComponentType<{
  curveId: bigint;
}> = ({ open, onClose, curveId }) => {
  const { data: parameters } = useCurveParameters(curveId);
  const type = getOperatorTypeByCurveId(sdkModuleName, curveId);

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
