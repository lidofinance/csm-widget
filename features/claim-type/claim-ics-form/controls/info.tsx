import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { CompareParametersList, FormTitle } from 'shared/components';
import { useCurveMetadata } from 'shared/hooks';
import styled from 'styled-components';
import { useClaimIcsFormData } from '../context';

export const Info: FC = () => {
  const { currentParameters, newParameters, currentCurve, newCurve } =
    useClaimIcsFormData();

  const currentMetadata = useCurveMetadata(currentCurve);
  const newMetadata = useCurveMetadata(newCurve);
  return (
    <>
      <FormTitle>Claim Identified Community Staker operator type</FormTitle>
      <Text size="xs">
        You are eligible to claim a new operator type. Claiming the Identified
        Community Staker operator type will change some parameters for your node
        operator according to the section below.
      </Text>
      <AccordionStyle summary="Parameter changes">
        <CompareParametersList
          items={[
            {
              parameters: currentParameters,
              title: `Current (${currentMetadata?.short ?? ''})`,
            },
            {
              parameters: newParameters,
              title: `New (${newMetadata?.short ?? ''})`,
            },
          ]}
        />
      </AccordionStyle>
    </>
  );
};

const AccordionStyle = styled(Accordion)`
  background: var(--lido-color-backgroundSecondary);

  p {
    margin: 0;
  }
`;
