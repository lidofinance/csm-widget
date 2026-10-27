import { useOperatorMetadata, OperatorRef } from 'modules/web3';
import { getOperatorName } from './operator-name';

/** Display texts for an operator; CM adds the metadata name */
export const useOperatorTitle = (operator: OperatorRef) => {
  const name = getOperatorName(operator);
  const { data: metadata } = useOperatorMetadata(operator);

  const metadataName = metadata?.name;

  return { name, title: metadataName || name, metadataName };
};
