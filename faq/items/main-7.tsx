import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import React from 'react';
import {
  FaqBondAmount,
  FaqChainName,
  FaqCurveImage,
  FaqIfModule,
} from 'shared/components';
import { Faq } from 'types';

export const Main7: Faq = {
  title: 'How much bond is needed?',
  anchor: 'how-much-bond-is-needed',
  content: (
    <div>
      <p>
        In 0x01 CSM, the bond is <FaqBondAmount type={OPERATOR_TYPE.CSM_DEF} />{' '}
        for the first validator (<FaqBondAmount type={OPERATOR_TYPE.CSM_ICS} />{' '}
        for Identified Community Stakers) and{' '}
        <FaqBondAmount type={OPERATOR_TYPE.CSM_DEF} second /> for subsequent
        validators.
        <FaqIfModule module={MODULE_NAME.CSM_02}>
          {' '}
          In 0x02 CSM, it is <FaqBondAmount type={OPERATOR_TYPE.CSM2_DEF} /> for
          the first validator and{' '}
          <FaqBondAmount type={OPERATOR_TYPE.CSM2_DEF} second /> for subsequent
          validators.
        </FaqIfModule>
      </p>
      <p>
        For the <FaqChainName />, the values for the bond curve are the
        following:
      </p>
      <FaqCurveImage />
    </div>
  ),
};
