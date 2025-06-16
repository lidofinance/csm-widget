import React from 'react';
import { Faq } from 'types';
import Image from 'next/image';
import curve from 'public/assets/mainnet-curve-common.png';

export const Keys3: Faq = {
  title: 'How much bond is needed?',
  anchor: 'how-bond-is-calculated',
  content: (
    <div>
      <p>
        The initial bond requirement for the first validator for the mainnet is
        2.4 stETH.
      </p>
      <p>The amount for the second and subsequent validators is 1.3 stETH</p>
      <p>For the mainnet, the values for the bond curve are the following:</p>
      <Image src={curve} alt="curve.png" />
    </div>
  ),
};
