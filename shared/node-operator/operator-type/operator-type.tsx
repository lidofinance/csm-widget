import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import {
  useDappStatus,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';
import { TypeButton } from './type-button';

/**
 * Operator type button for existing node operators.
 * Fetches the current operator's curve and delegates rendering to TypeButton.
 */
export const OperatorTypeButton: FC<ButtonProps> = (props) => {
  const { isSupportedChain, address } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: curve } = useOperatorCurveId(nodeOperator);

  if (!isSupportedChain || !address) return null;

  return <TypeButton curve={curve} {...props} />;
};
