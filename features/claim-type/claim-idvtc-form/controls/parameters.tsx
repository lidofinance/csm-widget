import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import {
  CompareParametersList,
  CompareParametersListItem,
} from 'shared/components';
import { useCurveMetadata } from 'shared/hooks';
import { ClaimIdvtcFormInputType, useClaimIdvtcFormData } from '../context';
import { AccordionStyle } from '../styles';

export const Parameters: FC = () => {
  const { currentParameters, newParameters, currentCurveId, newCurveId } =
    useClaimIdvtcFormData(true);

  const mode = useWatch<ClaimIdvtcFormInputType, 'mode'>({ name: 'mode' });

  const currentMetadata = useCurveMetadata(currentCurveId);
  const newMetadata = useCurveMetadata(newCurveId);

  const items: CompareParametersListItem[] = [
    {
      parameters: currentParameters,
      title: `Current (${currentMetadata?.short ?? ''})`,
    },
    {
      parameters: newParameters,
      title: `New (${newMetadata?.short ?? ''})`,
    },
  ];

  return (
    <AccordionStyle summary="Parameter changes">
      <CompareParametersList
        items={mode === 'create' ? items.slice(1) : items}
      />
    </AccordionStyle>
  );
};
