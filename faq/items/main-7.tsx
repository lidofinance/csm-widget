import React from 'react';
import { Faq } from 'types';
import Image from 'next/image';
import curve from 'public/assets/mainnet-curve-common.png';

export const Main7: Faq = {
  title: 'How much bond is needed?',
  anchor: 'how-much-bond-is-needed',
  content: (
    <div>
      <p>
        The initial bond requirement for the first validator for the mainnet is
        2.4 stETH. However, for Identified Community Stakers (ICS), this amount
        is reduced to 1.5 stETH to incentivize independent stakers
        participation.
      </p>
      <p>The amount for the second and subsequent validators is 1.3 stETH </p>
      <p>For the mainnet, the values for the bond curve are the following:</p>
      <Image src={curve} alt="curve.png" />
    </div>
  ),
};
