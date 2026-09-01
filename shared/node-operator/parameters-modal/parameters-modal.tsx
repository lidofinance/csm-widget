import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { useCurveParameters } from 'modules/web3';
import type { ModalComponentType } from 'providers/modal-provider';
import { ParametersList } from 'shared/components';
import { useDisplayOperatorType } from 'shared/hooks';
import { StyledModal } from './styles';

export const ParametersModal: ModalComponentType<{
  curveId: bigint;
  module?: MODULE_NAME;
}> = ({ open, onClose, curveId, module }) => {
  const { data: parameters } = useCurveParameters(curveId, undefined, module);
  const type = useDisplayOperatorType(curveId, module);
  const metadata = type ? OPERATOR_TYPE_METADATA[type] : undefined;

  return (
    <StyledModal
      title={metadata?.title ?? ''}
      onClose={onClose}
      open={open}
      $variant={type}
    >
      <ParametersList parameters={parameters} />
    </StyledModal>
  );
};
