import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';
import Image from 'next/image';
import curve from 'public/assets/mainnet-curve-common.png';

export const Keys4: Faq = {
  title: 'What is the bond curve?',
  anchor: 'what-is-the-bond-curve',
  content: (
    <div>
      <p>
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module#block-2d1c307d95fc4f8ab7c32b7584f795cf">
          The bond curve
        </FaqLink>{' '}
        is a function that determines the amount of bond required for each
        subsequent validator operated by the node operator.
      </p>
      <p>For the mainnet, the values for the bond curve are the following:</p>
      <Image src={curve} alt="curve.png" />
    </div>
  ),
};
