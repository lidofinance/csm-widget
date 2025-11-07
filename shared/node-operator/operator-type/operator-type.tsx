import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import {
  useDappStatus,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { TypeButton } from './type-button';

/**
 * Operator type button for existing node operators.
 * Fetches the curve ID from the current operator and delegates rendering to TypeButton.
 */
export const OperatorTypeButton: FC<ButtonProps> = (props) => {
  const { isSupportedChain, address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);

  if (!isSupportedChain || !address) return null;

  return <TypeButton curveId={curveId} {...props} />;
};
