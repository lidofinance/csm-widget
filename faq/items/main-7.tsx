import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import React from 'react';
import { FaqBondAmount, FaqChainName, FaqCurveImage } from 'shared/components';
import { Faq } from 'types';

export const Main7: Faq = {
  title: 'How much bond is needed?',
  anchor: 'how-much-bond-is-needed',
  content: (
    <div>
      <p>
        The initial bond requirement for the first validator for the{' '}
        <FaqChainName /> is <FaqBondAmount type={OPERATOR_TYPE.DEF} />. However,
        for Identified Community Stakers (ICS), this amount is reduced to{' '}
        <FaqBondAmount type={OPERATOR_TYPE.ICS} /> to incentivize independent
        stakers participation.
      </p>
      <p>
        The amount for the second and subsequent validators is{' '}
        <FaqBondAmount type={OPERATOR_TYPE.DEF} second />
      </p>
      <p>
        For the <FaqChainName />, the values for the bond curve are the
        following:
      </p>
      <FaqCurveImage />
    </div>
  ),
};
