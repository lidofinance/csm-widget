import { MODULE_METADATA } from 'consts/module';
import { OperatorRef } from 'modules/web3';

export const getOperatorName = ({ module, nodeOperatorId }: OperatorRef) =>
  `${MODULE_METADATA[module].shortName}#${nodeOperatorId}`;
